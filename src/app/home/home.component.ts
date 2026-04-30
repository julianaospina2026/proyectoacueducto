import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // 🔥 ESTO TE FALTABA
  imports: [CommonModule, RouterModule], // 🔥 ESTO ARREGLA EL ERROR DEL PIPE
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  scrolled = false;

  stats = [
    { label: 'Usuarios', value: 0, target: 5000 },
    { label: 'Litros', value: 0, target: 12000 },
    { label: 'Veredas', value: 0, target: 25 }
  ];

  ngOnInit(): void {
    this.animateCounters();
  }

  animateCounters() {
    this.stats.forEach(stat => {
      let increment = stat.target / 100;

      let interval = setInterval(() => {
        stat.value += increment;

        if (stat.value >= stat.target) {
          stat.value = stat.target;
          clearInterval(interval);
        }
      }, 20);
    });
  }

  ngAfterViewInit(): void {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    elements.forEach(el => observer.observe(el));
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

}