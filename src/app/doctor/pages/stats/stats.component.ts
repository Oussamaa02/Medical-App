import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { DoctorAppointmentDto } from '../../../models/appointment-dto.model';

@Component({
  selector: 'app-doctor-stats',
  templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule],
})
export class DoctorStatsComponent implements OnInit {
  loading = true;
  selectedPeriod: 'week' | 'month' | 'year' = 'month';

  public Math = Math;

  timePeriods = [
    { label: 'Last 4 Weeks', value: 'week' as const },
    { label: 'Last 6 Months', value: 'month' as const },
    { label: 'This Year', value: 'year' as const }
  ];

  allAppointments: DoctorAppointmentDto[] = [];
  filteredAppointments: DoctorAppointmentDto[] = [];

  // Enhanced Stats Data
  statsData = {
    totalAppointments: 0,
    presentPatients: 0,
    absentPatients: 0,
    completedAppointments: 0, // This stat isn't directly calculated from the current statuses, you might need to define 'COMPLETED' status
    attendanceRate: 0,
    cancellationRate: 0,
    // For comparison with previous period (example static values for now, you'd calculate this dynamically if needed)
    prevPeriodAttendanceRate: 82.3, // Example value for comparison
    prevPeriodTotalAppointments: 140, // Example value for comparison
  };

  detailedStats: any[] = [];

  // Enhanced Pie Chart Configuration
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total: number = context.dataset.data
              .filter((value): value is number => typeof value === 'number')
              .reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} appointments (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Present Patients', 'Absent Patients'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgb(59,130,246)',   // Green for present
        'rgb(107,114,128)'    // Red for absent
      ],
      hoverBackgroundColor: [
        'rgb(147,197,253)',
        'rgb(209,213,219)'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  // Enhanced Line Chart Configuration
  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Present Patients',
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgb(191,219,254)',
        pointBackgroundColor: 'rgb(59,130,246)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(59,130,246)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        data: [],
        label: 'Absent Patients',
        borderColor: 'rgb(107,114,128)',
        backgroundColor: 'rgb(229,231,235)',
        pointBackgroundColor: 'rgb(107,114,128)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(107,114,128)',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 11 }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          stepSize: 1,
          font: { size: 11 }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    }
  };

  public pieChartType: ChartType = 'pie';
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.doctorService.getAppointments().subscribe({
      next: (appointments) => {
        console.log('Loaded appointments:', appointments);
        // Assuming all appointments are in the future, we don't apply date filtering here yet as per your instruction.
        // We'll use allAppointments for detailed stats (trends) and filter for main stats.
        this.allAppointments = appointments;
        this.filterAppointments(); // Initially filter for the default period
        this.calculateStats(); // Calculate stats based on filtered appointments
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loading = false;
        // Optionally, display an error message to the user
      }
    });
  }

  filterAppointments(): void {
    const now = new Date();
    let startDate = new Date();

    // Define the date range based on selected period
    // Note: Since all appointments are in the future, this filtering will result in empty filteredAppointments
    // unless you adjust the logic to look at future dates or mock past appointments.
    switch (this.selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 28); // Last 4 weeks
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 6); // Last 6 months
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1); // Last 1 year
        break;
    }

    // Since your appointments are in the future, for demonstration, let's include all for now.
    // When you implement actual past appointments, this filter will be crucial.
    this.filteredAppointments = this.allAppointments.filter(app => {
      const appDate = new Date(app.date);
      // For now, including all appointments as per your instruction "all the appointmnets are in the future"
      // and "just work on all the appointments for now without filtering with date."
      // In a real scenario, you'd apply appDate >= startDate && appDate <= now
      return true; // Keep all appointments for main stats calculation for now
    });

    console.log(`Filtered appointments for ${this.selectedPeriod}:`, this.filteredAppointments);
  }

  calculateStats(): void {
    // Reset stats
    this.statsData = {
      totalAppointments: 0,
      presentPatients: 0,
      absentPatients: 0,
      completedAppointments: 0, // This is not directly derivable from current statuses, keep as 0 or remove
      attendanceRate: 0,
      cancellationRate: 0,
      prevPeriodAttendanceRate: this.statsData.prevPeriodAttendanceRate, // Keep previous for comparison display
      prevPeriodTotalAppointments: this.statsData.prevPeriodTotalAppointments,
    };

    // Calculate basic stats based on ALL appointments (as per your instruction for now)
    // If you want stats for the filtered period, change `this.allAppointments` to `this.filteredAppointments`
    const appointmentsForStats = this.allAppointments; // Use all appointments for overall stats for now

    this.statsData.totalAppointments = appointmentsForStats.length;
    this.statsData.presentPatients = appointmentsForStats.filter(
      app => app.status === 'BOOKED' || app.status === 'RESCHEDULED'
    ).length;
    this.statsData.absentPatients = appointmentsForStats.filter(
      app => app.status === 'CANCELED'
    ).length;

    // Calculate rates
    if (this.statsData.totalAppointments > 0) {
      this.statsData.attendanceRate = Math.round(
        (this.statsData.presentPatients / this.statsData.totalAppointments) * 100
      );
      this.statsData.cancellationRate = Math.round(
        (this.statsData.absentPatients / this.statsData.totalAppointments) * 100
      );
    }

    // Update pie chart data
    this.pieChartData.datasets[0].data = [
      this.statsData.presentPatients,
      this.statsData.absentPatients
    ];
    // This is important to trigger chart update in ng2-charts
    this.pieChartData = { ...this.pieChartData };

    // Calculate detailed stats and update line chart
    this.calculateDetailedStats(); // This will use allAppointments internally
    this.updateLineChart();

    console.log('Calculated stats:', this.statsData);
  }

  calculateDetailedStats(): void {
    this.detailedStats = [];
    const now = new Date();
    let periods: {label: string, start: Date, end: Date}[] = [];

    // Create appropriate time periods
    if (this.selectedPeriod === 'week') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - (7 * (i + 1)));
        start.setHours(0, 0, 0, 0); // Set to start of the day

        const end = new Date(now);
        end.setDate(now.getDate() - (7 * i));
        end.setHours(23, 59, 59, 999); // Set to end of the day

        periods.push({
          label: `Week ${4 - i}`,
          start,
          end
        });
      }
    } else if (this.selectedPeriod === 'month') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now);
        start.setMonth(now.getMonth() - i);
        start.setDate(1); // First day of month
        start.setHours(0, 0, 0, 0);

        const end = new Date(now);
        end.setMonth(now.getMonth() - i + 1);
        end.setDate(0); // Last day of month
        end.setHours(23, 59, 59, 999);

        periods.push({
          label: start.toLocaleString('default', { month: 'short', year: '2-digit' }),
          start,
          end
        });
      }
    } else { // year - monthly breakdown for current year
      const currentYear = now.getFullYear();
      for (let month = 0; month < 12; month++) {
        const start = new Date(currentYear, month, 1);
        start.setHours(0, 0, 0, 0);

        const end = new Date(currentYear, month + 1, 0);
        end.setHours(23, 59, 59, 999);

        // Only include months that have passed or current month for realistic trends
        if (start <= now) {
          periods.push({
            label: start.toLocaleString('default', { month: 'short' }),
            start,
            end: end > now ? now : end // Don't go beyond current date for the end of the last period
          });
        }
      }
    }

    // Calculate stats for each period using ALL appointments (for trends)
    periods.forEach((period, index) => {
      const periodApps = this.allAppointments.filter(app => {
        const appDate = new Date(app.date);
        return appDate >= period.start && appDate <= period.end;
      });

      const total = periodApps.length;
      const present = periodApps.filter(
        app => app.status === 'BOOKED' || app.status === 'RESCHEDULED'
      ).length;
      const absent = periodApps.filter(
        app => app.status === 'CANCELED'
      ).length;
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

      this.detailedStats.push({
        period: period.label,
        total,
        present,
        absent,
        attendanceRate,
        previousRate: index > 0 ? this.detailedStats[index - 1]?.attendanceRate : 0
      });
    });

    console.log('Detailed stats:', this.detailedStats);
  }

  updateLineChart(): void {
    // Update chart data
    this.lineChartData.labels = this.detailedStats.map(s => s.period);
    this.lineChartData.datasets[0].data = this.detailedStats.map(s => s.present);
    this.lineChartData.datasets[1].data = this.detailedStats.map(s => s.absent);

    // This is important to trigger chart update in ng2-charts
    this.lineChartData = { ...this.lineChartData };
  }

  changeTimePeriod(period: 'week' | 'month' | 'year'): void {
    this.selectedPeriod = period;
    this.filterAppointments(); // Re-filter main stats based on new period
    this.calculateStats(); // Re-calculate all stats including detailed ones
  }

  getPercentage(part: number | undefined, total: number | undefined): string {
    if (typeof part === 'undefined' || typeof total === 'undefined' || total === 0) return '0';
    return Math.round((part / total) * 100).toString();
  }

  // Helper method to get trend direction
  getTrendDirection(currentRate: number, previousRate: number): 'up' | 'down' | 'same' {
    if (currentRate > previousRate) return 'up';
    if (currentRate < previousRate) return 'down';
    return 'same';
  }

  // Helper method to get status badge color
  getStatusColor(rate: number): string {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }
}