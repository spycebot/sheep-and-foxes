import { SheepAndFoxesPage } from './app.po';

describe('sheep-and-foxes App', () => {
  let page: SheepAndFoxesPage;

  beforeEach(() => {
    page = new SheepAndFoxesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
