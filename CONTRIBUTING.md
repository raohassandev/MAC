# Contributing to MacSys

## 🎉 Welcome Contributors!

Thank you for your interest in contributing to MacSys! This guide will help you get started.

## 📋 How to Contribute

### 1. Setup Development Environment

1. Fork the repository
2. Clone your fork
```bash
git clone https://github.com/your-username/macsys.git
cd macsys
```

3. Install dependencies
```bash
# Backend
cd macsys_engine
npm install

# Frontend
cd ../macsys_web
npm install
```

### 2. Creating a Branch

Create a descriptive branch for your contribution:
```bash
git checkout -b feature/your-feature-name
# OR
git checkout -b bugfix/issue-description
```

### 3. Development Guidelines

#### Backend (macsys_engine)
- Follow Node.js best practices
- Use ESLint for code linting
- Write unit tests for new features
- Use async/await for asynchronous operations

#### Frontend (macsys_web)
- Use React functional components
- Implement TypeScript
- Follow React hooks best practices
- Use Tailwind CSS for styling

### 4. Commit Messages

Write clear, descriptive commit messages:
```
type(scope): Short description

- Detailed explanation of changes
- Reason for the change
- Additional context if needed
```

#### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Pull Request Process

1. Ensure all tests pass
```bash
npm test
```

2. Update documentation if needed

3. Open a Pull Request with:
   - Clear title
   - Description of changes
   - Related issue number (if applicable)

### 6. Code Review Process

- Maintainers will review your PR
- Provide feedback and suggestions
- Make requested changes
- Once approved, your PR will be merged

## 🐛 Reporting Bugs

1. Check existing issues
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment details

## 💡 Feature Requests

1. Check existing feature requests
2. Open a new issue describing:
   - Feature purpose
   - Proposed implementation
   - Potential benefits

## 🛡️ Code of Conduct

- Be respectful
- Collaborate constructively
- Welcome diverse perspectives

## 🏆 Recognition

Contributors will be acknowledged in the project README and release notes.

## Questions?

Open an issue or discuss in our community channels.

Happy Contributing! 🚀