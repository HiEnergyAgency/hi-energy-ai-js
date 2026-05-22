# Contributing to hi-energy-ai-js

Thank you for helping improve the official JavaScript/TypeScript client for the [Hi Energy API](https://app.hienergy.ai/api_documentation).

## Reporting issues

Before opening an issue, check [existing issues](https://github.com/HiEnergyAgency/hi-energy-ai-js/issues) to avoid duplicates.

**Use issues for:**

- Bugs in the SDK (wrong endpoints, params, types, errors, pagination)
- Missing API resources or methods that exist in the [API documentation](https://app.hienergy.ai/api_documentation)
- TypeScript type improvements
- Documentation improvements
- Feature requests for the JavaScript/TypeScript client

**Open an issue on GitHub:**

1. Go to [github.com/HiEnergyAgency/hi-energy-ai-js/issues](https://github.com/HiEnergyAgency/hi-energy-ai-js/issues)
2. Click **New issue**
3. Choose **Bug report** or **Feature request**
4. Fill in the template with as much detail as possible

**Please include (for bugs):**

- Node.js version (`node -v`)
- Package version (from `package.json` or `npm list hi-energy-ai`)
- Minimal TypeScript/JavaScript code to reproduce
- Expected vs actual behavior
- API response status/body if relevant (redact API keys)

**API platform issues** (auth, rate limits, data correctness on the server) may need to be reported through Hi Energy AI support rather than this repository.

## Submitting pull requests

We welcome pull requests that fix bugs, add API coverage, improve types, or improve docs/tests.

### Workflow

1. **Fork** [hi-energy-ai-js](https://github.com/HiEnergyAgency/hi-energy-ai-js) on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hi-energy-ai-js.git
   cd hi-energy-ai-js
   ```
3. **Create a branch** from `main`:
   ```bash
   git checkout -b your-short-description
   ```
4. **Install dependencies** and run checks:
   ```bash
   npm install
   npm test
   npm run build
   ```
5. **Make your changes** — match existing style and keep the diff focused
6. **Commit** with a clear message describing *why* the change is needed
7. **Push** to your fork:
   ```bash
   git push -u origin your-short-description
   ```
8. **Open a pull request** against `HiEnergyAgency/hi-energy-ai-js` → `main`:
   - Go to your fork on GitHub and click **Compare & pull request**, or
   - Visit [github.com/HiEnergyAgency/hi-energy-ai-js/compare](https://github.com/HiEnergyAgency/hi-energy-ai-js/compare)
9. Fill in the PR template (summary, test plan, linked issue if any)
10. Wait for review — maintainers may request changes before merge

### PR guidelines

- One logical change per PR when possible
- Add or update tests in `test/` for behavior changes
- Do not commit API keys, `.env` files, or credentials
- Ensure `npm test` and `npm run build` pass before requesting review

### Development setup

```bash
git clone https://github.com/HiEnergyAgency/hi-energy-ai-js.git
cd hi-energy-ai-js
npm install
npm test
npm run build
```

## Code of conduct

Be respectful and constructive in issues and pull requests.

## Questions

- **API usage:** [app.hienergy.ai/api_documentation](https://app.hienergy.ai/api_documentation)
- **Ruby SDK:** [hi-energy-ai-ruby](https://github.com/HiEnergyAgency/hi-energy-ai-ruby)
- **npm package:** [hi-energy-ai](https://www.npmjs.com/package/hi-energy-ai)
