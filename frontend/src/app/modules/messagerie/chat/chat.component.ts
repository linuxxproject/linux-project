import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  private shouldScroll = false;
  role = localStorage.getItem('role') || 'freelance';
  user: any = null;

  newMessage = '';
  selectedConversation: any = null;

  conversations: any[] = [];
  messages: any[] = [];
  users: any[] = [];

  loading = false;
  error = '';

  showNewConversation = false;
  selectedUserId: number | null = null;
  newConversationMessage = '';

  constructor(
    private messageService: MessageService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.loadConversations();
    this.loadUsers();
  }

  loadConversations(): void {
    this.loading = true;

    this.messageService.getConversations().subscribe({
      next: (res: any) => {
        this.conversations = res || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des conversations.';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || res || [];
      },
      error: () => {
        console.warn('Impossible de charger la liste des utilisateurs.');
      }
    });
  }

  selectConversation(conversation: any): void {
    this.selectedConversation = conversation;

    this.messageService.getMessages(conversation.id).subscribe({
      next: (res: any) => {
        this.messages = res.data || res;
        this.shouldScroll = true;
      },
      error: () => {
        alert('Erreur lors du chargement des messages.');
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    this.messageService.sendMessage(this.selectedConversation.id, this.newMessage).subscribe({
      next: (msg: any) => {
        this.messages.push(msg);
        this.newMessage = '';
        this.shouldScroll = true;
        this.loadConversations();
      },
      error: (err) => {
        console.error('Erreur envoi message:', err);
        const backendMsg = err.error?.message || err.error?.error || err.statusText || 'Erreur inconnue';
        alert('Erreur lors de l\'envoi du message : ' + backendMsg + ' (status ' + err.status + ')');
      }
    });
  }

  startNewConversation(): void {
    if (!this.selectedUserId || !this.newConversationMessage.trim()) {
      alert('Veuillez sélectionner un utilisateur et écrire un message.');
      return;
    }

    const userId = Number(this.selectedUserId);
    if (isNaN(userId) || userId <= 0) {
      alert('ID utilisateur invalide.');
      return;
    }

    this.messageService.startConversation(userId, this.newConversationMessage).subscribe({
      next: (res: any) => {
        this.showNewConversation = false;
        this.selectedUserId = null;
        this.newConversationMessage = '';
        this.loadConversations();
        if (res.conversation) {
          this.selectConversation(res.conversation);
        }
      },
      error: (err) => {
        console.error('Erreur startConversation:', err);
        const backendMsg = err.error?.message || err.error?.error || err.statusText || 'Erreur inconnue';
        alert('Erreur lors du démarrage de la conversation : ' + backendMsg + ' (status ' + err.status + ')');
      }
    });
  }

  getOtherParticipant(conversation: any): any {
    if (!conversation?.participants) return null;
    return conversation.participants.find((p: any) => p.id !== this.user?.id);
  }

  initials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  userInitials(): string {
    return this.initials(this.user?.name);
  }

  isMe(message: any): boolean {
    return message.sender_id === this.user?.id;
  }
}
