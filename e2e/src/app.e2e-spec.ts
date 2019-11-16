import { browser, By, protractor } from 'protractor';
import {
  Options,
  RegressionSlopeValidator,
  Runner,
  SeleniumWebDriverAdapter,
  Validator,
} from '@angular/benchpress';

const runner = new Runner([
  SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
  // use RegressionSlopeValidator to validate samples
  {provide: Validator, useExisting: RegressionSlopeValidator},
  // use 10 samples to calculate slope regression
  {provide: RegressionSlopeValidator.SAMPLE_SIZE, useValue: 50},
  // use the script metric to calculate slope regression
  {provide: RegressionSlopeValidator.METRIC, useValue: 'scriptTime'},
  {provide: Options.FORCE_GC, useValue: false}
]);

async function runTest(id: string, test: () => void, done: DoneFn) {
  await browser.get(`http://localhost:4201`);

  return runner.sample({
    id,
    execute: async () => {
      await test();
    },
    providers: [
      {
        provide: Options.SAMPLE_DESCRIPTION,
        useValue: {depth: 11}
      }
    ]
  }).then(done);
}

describe('Zoneless Benchmark', () => {
  it('should create 1000 rows', async (done) => {
    const test = async () => {
      const button = protractor.element(By.id('create_1000'));
      await button.click();
    };
    await runTest('should create 1000 rows', test, done);
  });

  it('should create 10000 rows', done => {
    const test = async () => {
      const button = protractor.element(By.id('create_10000'));
      await button.click();
    };
    runTest('should create 10000 rows', test, done);
  });

  it('should append 1000 rows', done => {
    const test = async () => {
      const button = protractor.element(By.id('create_1000'));
      await button.click();
      const appendButton = protractor.element(By.id('append_1000'));
      await appendButton.click();
    };
    runTest('should append 1000 rows', test, done);
  });

  it('should remove all rows', done => {
    const test = async () => {
      const button = protractor.element(By.id('create_10000'));
      await button.click();
      const removeButton = protractor.element(By.id('remove_all'));
      await removeButton.click();
    };

    runTest('should remove all rows', test, done);
  });
});
