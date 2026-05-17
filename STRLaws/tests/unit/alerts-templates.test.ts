import { describe, expect, it } from 'vitest';
import { confirmationEmail, regulationChangeAlert } from '../../server/lib/alerts/templates';

describe('confirmationEmail', () => {
  it('produces a deliverable EmailMessage shape', () => {
    const msg = confirmationEmail({ toEmail: 'daniel@example.com', confirmToken: 'tok_abc123' });
    expect(msg.to).toBe('daniel@example.com');
    expect(msg.subject).toMatch(/confirm/i);
    expect(msg.text).toContain('tok_abc123');
    expect(msg.html).toContain('tok_abc123');
    expect(msg.tags).toMatchObject({ type: 'confirmation' });
  });

  it('URL-encodes the confirm token', () => {
    const msg = confirmationEmail({ toEmail: 'x@y.com', confirmToken: 'a/b+c=d' });
    expect(msg.text).toContain('a%2Fb%2Bc%3Dd');
  });

  it('plain text and html both contain a confirm link', () => {
    const msg = confirmationEmail({ toEmail: 'x@y.com', confirmToken: 'tok' });
    expect(msg.text).toMatch(/https?:\/\/[^\s]+\/api\/alerts\/confirm/);
    expect(msg.html).toMatch(/https?:\/\/[^\s"']+\/api\/alerts\/confirm/);
  });
});

describe('regulationChangeAlert', () => {
  const base = {
    toEmail: 'daniel@example.com',
    cityName: 'Salt Lake City',
    stateName: 'Utah',
    citySlug: 'salt-lake-city',
    stateSlug: 'utah',
    blogPostSlug: 'slc-major-2026-05-14',
    summary: 'Permit fee doubled to $400.',
  };

  it('subject reflects severity label and city', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'major' });
    expect(msg.subject).toContain('Major');
    expect(msg.subject).toContain('Salt Lake City');
    expect(msg.subject).toContain('Utah');
  });

  it('embeds the summary text in body', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'material' });
    expect(msg.text).toContain('Permit fee doubled to $400.');
    expect(msg.html).toContain('Permit fee doubled to $400.');
  });

  it('falls back to a generic line when summary is null', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'minor', summary: null });
    expect(msg.text.toLowerCase()).toContain('minor');
    expect(msg.text).toContain('Salt Lake City');
  });

  it('links to the blog post when blogPostSlug is set', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'major' });
    expect(msg.text).toContain('/blog/slc-major-2026-05-14');
    expect(msg.html).toContain('/blog/slc-major-2026-05-14');
  });

  it('omits blog link when blogPostSlug is null', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'minor', blogPostSlug: null });
    expect(msg.text).not.toContain('/blog/');
  });

  it('always links to the city regulation page', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'material' });
    expect(msg.text).toContain('/utah/salt-lake-city');
    expect(msg.html).toContain('/utah/salt-lake-city');
  });

  it('tags the message for downstream provider analytics', () => {
    const msg = regulationChangeAlert({ ...base, severity: 'major' });
    expect(msg.tags).toMatchObject({
      type: 'regulation_change',
      severity: 'major',
      city_slug: 'salt-lake-city',
      state_slug: 'utah',
    });
  });
});
