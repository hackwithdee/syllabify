import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Friendship, ChatMessage } from '@/lib/types';
import { getFriendships, sendFriendRequest, respondToFriendRequest, searchProfiles, getChatMessages, sendMessage, markMessagesRead } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, UserPlus, MessageCircle, Send, Check, X, ArrowLeft } from 'lucide-react';

interface FriendsPageProps {
  userId: string;
  userName: string;
}

const FriendsPage = ({ userId, userName }: FriendsPageProps) => {
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendProfiles, setFriendProfiles] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ user_id: string; full_name: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeChatFriend, setActiveChatFriend] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const refresh = async () => {
    const fs = await getFriendships(userId);
    setFriendships(fs);
    // Fetch friend names
    const ids = new Set<string>();
    fs.forEach(f => {
      ids.add(f.requester_id === userId ? f.addressee_id : f.requester_id);
    });
    const profiles: Record<string, string> = {};
    for (const id of ids) {
      const { data } = await supabase.from('profiles').select('full_name').eq('user_id', id).single();
      if (data) profiles[id] = (data as any).full_name || 'User';
    }
    setFriendProfiles(profiles);
  };

  useEffect(() => { refresh(); }, [userId]);

  // Realtime chat
  useEffect(() => {
    if (!activeChatFriend) return;
    loadChat(activeChatFriend);
    const channel = supabase
      .channel('chat-' + activeChatFriend)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const msg = payload.new as ChatMessage;
        if ((msg.sender_id === userId && msg.receiver_id === activeChatFriend) ||
            (msg.sender_id === activeChatFriend && msg.receiver_id === userId)) {
          setMessages(prev => [...prev, msg]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeChatFriend, userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChat = async (friendId: string) => {
    const msgs = await getChatMessages(userId, friendId);
    setMessages(msgs);
    await markMessagesRead(userId, friendId);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    const results = await searchProfiles(searchQuery.trim());
    setSearchResults(results.filter(r => r.user_id !== userId));
    setSearching(false);
  };

  const handleSendRequest = async (addresseeId: string) => {
    try {
      await sendFriendRequest(userId, addresseeId);
      refresh();
      setSearchResults([]);
      setSearchQuery('');
    } catch { /* duplicate */ }
  };

  const handleRespond = async (friendshipId: string, status: 'accepted' | 'declined') => {
    await respondToFriendRequest(friendshipId, status);
    refresh();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatFriend) return;
    await sendMessage(userId, activeChatFriend, newMessage.trim());
    setNewMessage('');
  };

  const accepted = friendships.filter(f => f.status === 'accepted');
  const pendingReceived = friendships.filter(f => f.status === 'pending' && f.addressee_id === userId);
  const pendingSent = friendships.filter(f => f.status === 'pending' && f.requester_id === userId);

  const getFriendId = (f: Friendship) => f.requester_id === userId ? f.addressee_id : f.requester_id;

  // Chat view
  if (activeChatFriend) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setActiveChatFriend(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {(friendProfiles[activeChatFriend] || '?')[0].toUpperCase()}
          </div>
          <h2 className="font-display font-bold">{friendProfiles[activeChatFriend] || 'Friend'}</h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 bg-muted/30 rounded-xl p-4">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No messages yet. Say hello! 👋</p>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender_id === userId ? 'gradient-primary text-primary-foreground' : 'bg-card shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2 mt-3">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="h-11"
            autoFocus
          />
          <Button type="submit" className="gradient-primary border-0 h-11" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">Friends & Chat</h1>
        <p className="text-muted-foreground mt-1">Connect with accountability partners</p>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search users by name..."
                className="pl-9 h-11"
              />
            </div>
            <Button onClick={handleSearch} disabled={searching} className="gradient-primary border-0">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map(u => {
                const alreadyFriend = friendships.some(f =>
                  (f.requester_id === u.user_id || f.addressee_id === u.user_id));
                return (
                  <div key={u.user_id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">{u.full_name}</span>
                    <Button size="sm" variant="outline" disabled={alreadyFriend} onClick={() => handleSendRequest(u.user_id)}>
                      {alreadyFriend ? 'Added' : 'Add Friend'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending requests */}
      {pendingReceived.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg font-display">Friend Requests</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pendingReceived.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm font-medium">{friendProfiles[f.requester_id] || 'User'}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleRespond(f.id, 'accepted')} className="gradient-primary border-0">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRespond(f.id, 'declined')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends list */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-display">Your Friends ({accepted.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {accepted.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">No friends yet. Search above to find study partners!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {accepted.map(f => {
                const friendId = getFriendId(f);
                return (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full gradient-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                        {(friendProfiles[friendId] || '?')[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{friendProfiles[friendId] || 'Friend'}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setActiveChatFriend(friendId)}>
                      <MessageCircle className="h-4 w-4 mr-1" /> Chat
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {pendingSent.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="text-lg font-display">Sent Requests</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pendingSent.map(f => (
              <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">{friendProfiles[f.addressee_id] || 'User'}</span>
                <Badge variant="outline" className="text-xs">Pending</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FriendsPage;
