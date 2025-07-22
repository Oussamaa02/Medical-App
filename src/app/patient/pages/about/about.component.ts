import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
  bgClass: string;
  linkColor: string;
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
}

interface Stat {
  value: string;
  label: string;
}

@Component({
    standalone: true,
  selector: 'app-patient-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule]
})
export class PatientAboutComponent implements OnInit {

  features: Feature[] = [
    {
      icon: 'fas fa-calendar-alt',
      title: 'Easy Booking',
      description: 'Book appointments with specialists in just a few clicks. Our intuitive interface makes scheduling effortless.',
      bgClass: 'bg-blue-gradient',
      linkColor: 'text-blue-600'
    },
    {
      icon: 'fas fa-clock',
      title: 'Real-time Availability',
      description: 'See doctors\' available time slots instantly with live updates and automatic notifications.',
      bgClass: 'bg-gray-gradient',
      linkColor: 'text-gray-600'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security and complete privacy compliance.',
      bgClass: 'bg-blue-dark-gradient',
      linkColor: 'text-blue-700'
    },
    
  ];

  steps: Step[] = [
    {
      number: 1,
      title: 'Find a Doctor',
      description: 'Browse our network of qualified specialists and view their profiles, availability, and patient reviews. Use our advanced filters to find the perfect match for your needs.',
      icon: 'fas fa-search',
      iconColor: 'text-blue-500'
    },
    {
      number: 2,
      title: 'Book Your Appointment',
      description: 'Select your preferred time slot from the doctor\'s real-time availability. Our system automatically handles scheduling conflicts and sends confirmation notifications.',
      icon: 'fas fa-calendar-check',
      iconColor: 'text-gray-500'
    },
    {
      number: 3,
      title: 'Prepare for Your Visit',
      description: 'Fill out pre-visit forms online, and upload any necessary documents or test results to streamline your consultation.',
      icon: 'fas fa-file-medical',
      iconColor: 'text-blue-500'
    },
    {
      number: 4,
      title: 'Follow Up & Manage',
      description: 'Access your consultation notes, prescriptions, and follow-up instructions. Schedule additional appointments and track your health progress all in one place.',
      icon: 'fas fa-chart-line',
      iconColor: 'text-gray-500'
    }
  ];



  constructor(private router: Router) { }

  ngOnInit(): void {
    // Component initialization logic
    this.animateStatsOnScroll();
  }

  onGetStarted(): void {
    this.router.navigate(['/patient/home']);
  }


  private animateStatsOnScroll(): void {
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stats-animate');
        }
      });
    });

    // Observe stats section when it's available in DOM
    setTimeout(() => {
      const statsSection = document.querySelector('.bg-gradient-to-r');
      if (statsSection) {
        observer.observe(statsSection);
      }
    }, 100);
  }

  // Utility method for tracking by index in *ngFor
  trackByIndex(index: number, item: any): number {
    return index;
  }
}