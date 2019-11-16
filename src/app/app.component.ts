import { ChangeDetectionStrategy, Component } from '@angular/core';
import { observed } from './observed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public data = [];

  @observed()
  run(length: number) {
    this.clear();
    this.buildData(length);
  }

  @observed()
  append(length: number) {
    this.buildData(length);
  }

  @observed()
  removeAll() {
    this.clear();
  }

  @observed()
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
