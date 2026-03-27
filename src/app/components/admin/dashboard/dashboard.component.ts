import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../../../services/statistics.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartCanvas!: ElementRef;
  
  revenueData: any[] = [];
  confirmedProducts: any[] = [];
  selectedPeriod: string = 'monthly';
  chart: any;
  loading = true;

  constructor(private statsService: StatisticsService) { }

  ngOnInit() {
    this.loadConfirmedProducts();
    this.loadRevenueData();
  }

  ngAfterViewInit() {
    // Chart will be initialized after first data load
  }

  loadRevenueData() {
    this.loading = true;
    this.statsService.getRevenueStats(this.selectedPeriod).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.updateChart();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadConfirmedProducts() {
    this.statsService.getConfirmedProducts().subscribe({
      next: (data) => {
        this.confirmedProducts = data;
      }
    });
  }

  onPeriodChange() {
    this.loadRevenueData();
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.revenueData.map(d => d.label);
    const values = this.revenueData.map(d => d.value);

    this.chart = new Chart(this.revenueChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu (₫)',
          data: values,
          borderColor: '#ffc107',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ffc107',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => new Intl.NumberFormat('vi-VN').format(Number(value)) + '₫'
            }
          }
        }
      }
    });
  }
}
