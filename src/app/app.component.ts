import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public data = [];

  run(length: number) {
    this.clear();
    this.buildData(length);
  }

  append(length: number) {
    this.buildData(length);
  }

  removeAll() {
    this.clear();
  }

  remove(item) {
    for (let i = 0, l = this.data.length; i < l; i++) {
      if (this.data[i].id === item.id) {
        this.data.splice(i, 1);
        break;
      }
    }
  }

  trackById(item) {
    return item.id;
  }

  private clear() {
    this.data = [];
  }

  private buildData(length: number) {
    const start = this.data.length;
    const end = start + length;

    for (let n = start; n <= end; n++) {
      this.data.push({
        id: n,
        label: Math.random()
      });
    }
  }
}
