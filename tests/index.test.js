const { extractLinks, checkUrl } = require('../src/index');

describe('Markdown Link Extractor', () => {
  test('should extract links correctly from markdown content', () => {
    const text = 'This is a [Google](https://google.com) link and [local file](local.md).';
    const links = extractLinks(text);
    expect(links).toHaveLength(2);
    expect(links[0]).toEqual({ text: 'Google', url: 'https://google.com' });
    expect(links[1]).toEqual({ text: 'local file', url: 'local.md' });
  });

  test('should return empty list when no links are present', () => {
    const text = 'This is plain text with no links.';
    const links = extractLinks(text);
    expect(links).toHaveLength(0);
  });
});

describe('Link Validator', () => {
  test('should return ALIVE for valid links', async () => {
    const res = await checkUrl('https://google.com');
    expect(res.status).toBe('ALIVE');
  });

  test('should return DEAD for invalid local files', async () => {
    const res = await checkUrl('non-existent-file-path-xyz.md');
    expect(res.status).toBe('DEAD');
  });

  test('should support custom timeout options', async () => {
    const res = await checkUrl('https://google.com', 1000);
    expect(res.status).toBe('ALIVE');
  });
});
