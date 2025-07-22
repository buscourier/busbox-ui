# Angular 18 Starter

[Русский](README.md) | [English](README.en.md)

## Description

The project uses **Tailwind CSS** for styling and **Doppler** for managing environment variables.
The project can be run both locally and through Docker. Deployment is implemented for both production and test servers.

## Navigation

1. [Preparing the project for launch](#preparing-the-project-for-launch)

- [Locally](#1-locally)
- [GitHub settings](#2-github-settings)
- [Doppler settings](#3-doppler-settings)

2. [Launching the project](#launching-the-project)

- [Locally](#locally-1)
- [In Docker](#in-docker)

3. [Managing environment variables through Doppler](#managing-environment-variables-through-doppler)

- [Installation](#installation)
- [Connecting to the project](#connecting-to-the-project)
- [Getting a secret](#getting-a-secret)

4. [Git branch workflow](#git-branch-workflow)
5. [Working with tags](#working-with-tags)
6. [Additional Git commands](#additional-git-commands)

- [Deleting branches](#deleting-branches)
- [Updating branch information](#updating-branch-information)
- [Managing file tracking](#managing-file-tracking)

7. [Adding a domain](#adding-a-domain)

## Preparing the project for launch

### 1. Locally

- Clone the project to your computer:
  - `https://github.com/buscourier/busbox-ui.git`
- Navigate to the project and install dependencies:
  - `npm ci`
- Activate the `develop` branch in the project:
  - `git checkout develop`

### 2. GitHub settings

- Go to the project on `github.com`
- Go to `Settings` -> `Branches` and create protection rules for `main` and `develop` branches:
  - `Require a pull request before merging` (nested settings not needed)
  - `Require status checks to pass before merging`:
    - `Require branches to be up to date before merging`:
      - `build-and-test` (may not be available before the first pull request)
      - `security-scan` (may not be available before the first pull request)
      - `docker-build` (may not be available before the first pull request)

- Go to `Settings` -> `Environments`:
  - Create two environments: `production` and `staging`
- Go to `Settings` -> `Actions` -> `Workflow permissions`:
  - Set `Read and write permissions`
  - Set `Allow GitHub Actions to create and approve pull requests`

### 3. Doppler settings

- Register at [doppler.com](https://www.doppler.com/)
- Create a workspace
- Create a project
- Add environment variables for necessary environments in the project:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  - `SSH_HOST`
  - `SSH_KEY`
  - `SSH_PORT`
  - `SSH_PASSPHRASE`
  - `SSH_USER`
  - `STRAPP_API_BASE_URL` (name may change depending on the backend)

- Go to `Integrations` and synchronize environments with the project on GitHub and corresponding environments in it

### 4. Preparation complete!

## Launching the project

### Locally

- `make serve`

### In Docker

- `./docker.sh dev|stage|prod` (default is `dev`, can be omitted)

## Managing environment variables through Doppler

### Installation

1. **Install gnupg to verify binary file signatures:**

- `brew install gnupg`

2. **Install Doppler CLI:**

- `brew install dopplerhq/cli/doppler`

### Connecting to the project

1. **Authenticate in Doppler:**

- `doppler login`

2. **Choose config:**

- `doppler setup`

3. **Run a command, for example, `ng serve`:**

- `doppler run --config dev|stage|prod ng serve`

### Getting a secret

- `doppler secrets get 'SOME_SECRET' --plain`

## Git branch workflow

1. **Create a feature branch from the `develop` branch**

- For example, `git checkout -b feature/new-feature`
- Implement the necessary functionality in this branch

2. **Push data to GitHub after completing work**

- `git commit -m "feat(new-feature): Create new feature"`
- `git push origin -u feature/new-feature`

3. **Create a pull request to the `develop` branch**

- After the pull request is approved, deployment to the TEST server occurs

4. **Switch to the local `develop` branch for further development**

- `git checkout develop`
- Get data from the remote `develop` branch: `git pull`

5. **Create a new feature branch to implement a new task**

6. **Create a pull request from the `develop` branch to the `main` branch for release**

7. **Switch to the local `main` branch and get data**

- `git pull`

8. **Create a tag for the release**

- For example, `git tag -a v1.0.0 -m "Release version 1.0.0"`

9. **Push the tag and deploy to the PRODUCTION server**

- `git push origin v1.0.0`

10. **Update the `develop` branch after creating a release**

- Switch to the `develop` branch: `git checkout develop`
- Check for unrecieved data: `git pull`
- Merge with the `main` branch: `git merge origin/main`

11. **Continue development**

## Working with tags

1. **Create a lightweight tag:**

- `git tag v1.0.0`

2. **Create an annotated tag (recommended for releases):**

- `git tag -a v1.0.0 -m "Release version 1.0.0"`
  - The `-a` flag creates an annotated tag, and `-m` allows adding a message.

3. **Create a tag for a specific commit:**

- `git tag -a v1.0.0 9fceb02 -m "Release version 1.0.0"`

4. **Push a tag to the remote repository:**

- `git push origin v1.0.0`

5. **View existing tags:**

- `git tag`

6. **View information about a specific tag:**

- `git show v1.0.0`

7. **Delete a local tag:**

- `git tag -d v1.0.0`

8. **Delete a remote tag:**

- `git push origin :refs/tags/v1.0.0`

9. **Delete both local and remote tag:**

- `git push origin --delete v1.0.0`

## Additional Git commands

### Deleting branches

- **Delete a remote branch named "feature-branch":**
  - `git push origin --delete feature-branch`

- **Delete the corresponding local branch:**
  - `git branch -d <branch_name>`

### Updating branch information

- **Update information about remote branches and delete references to non-existent branches:**
  - `git fetch --all --prune`

### Managing file tracking

- **Make a file untracked in git:**
  - `git update-index --assume-unchanged src/environments/environment.test.ts`

- **Make a file tracked in git:**
  - `git update-index --no-assume-unchanged src/environments/environment.test.ts`

### Testing the project

- Run tests `npm run test`
- Run lint `npm run lint`
- Workflow tests:
  - ./act.sh `workflow_name` `config_name`

### Adding a domain

- Go to the root of the remote server project
- Create a `nginx` directory
- Configure Nginx Proxy Manager by following the instructions on the website:
  - [Nginx Proxy Manager Guide](https://nginxproxymanager.com/guide/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
