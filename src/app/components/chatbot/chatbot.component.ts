import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  
  messages: any[] = [];
  userMessage: string = '';
  isTyping: boolean = false;
  isRotating: boolean = false;

  ngOnInit() {
    // Add welcome message
    this.messages.push({
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    });
  }

  toggleChat() {
    this.isRotating = true;
    setTimeout(() => {
      this.isRotating = false;
      this.toggle.emit();
    }, 500);
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message
    this.messages.push({
      text: this.userMessage,
      sender: 'user',
      timestamp: new Date()
    });

    const userMsg = this.userMessage.toLowerCase();
    this.userMessage = '';
    this.isTyping = true;

    // Simulate AI response
    setTimeout(() => {
      let botResponse = this.getBotResponse(userMsg);
      this.messages.push({
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      });
      this.isTyping = false;
    }, 1000);
  }

  getBotResponse(message: string): string {
    if (message.includes('hello') || message.includes('hi')) {
      return 'Hello! How can I assist you today?';
    } else if (message.includes('attendance')) {
      return 'You can mark your attendance in the Attendance page. Would you like me to navigate you there?';
    } else if (message.includes('member') || message.includes('add')) {
      return 'To add a new member, go to the Add Member page. I can help you with the process!';
    } else if (message.includes('dashboard')) {
      return 'The dashboard shows your statistics, attendance charts, and birthday wishes. Is there anything specific you\'d like to know?';
    } else if (message.includes('help')) {
      return 'I can help you with:\n- Attendance information\n- Adding members\n- Dashboard queries\n- General questions\n\nWhat would you like to know?';
    } else if (message.includes('thank')) {
      return 'You\'re welcome! Feel free to ask if you need anything else.';
    } else {
      return 'I understand. Let me help you with that. Can you provide more details?';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
