import { PongAssistRxPage } from './app.po';

describe('pong-assist-rx App', () => {
  let page: PongAssistRxPage;

  beforeEach(() => {
    page = new PongAssistRxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
