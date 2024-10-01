# Repo for the SWE573 - Software Development Practice Course at Bogazici University 📚

This repo will be used throughout this semester for this course.

---

# Git 📂

## Overview ✨

Git is a widely used version control system that saves the snapshot of a project every time a change is made to it. Git is a distributed version control system, meaning, the clients (developers) fully mirror the codebase instead of just checking out the latest snapshots of files. This way, the project is mirrored on every client, including its full history. Therefore if any server or client dies or gets corrupted, any one of the working repositories can be copied to everyone to restore the whole project.

> **Every clone is really a full backup of all the data.**

---

## Core Git Features 🔑

1. [Branching and Merging](#branching-and-merging) 🌱
2. [Small and Fast](#small-and-fast) ⚡
3. [Distributed](#distributed) 🌍
4. [Data Assurance](#data-assurance) 🔒

---

## Branching and Merging 🌱

The most distinguishing feature of git among other version control systems is its **branching and merging** model. Thanks to branching, you can have multiple versions of the project that are independent of each other. Branching allows a developer to:
- Test an idea,
- Experiment on the existing project without messing it up,
- Have a branch for every new feature (so that you can switch easily between branches to see a version of the app with and without the feature).

When you want to merge two branches, git automatically detects changes in files and merges the lines seamlessly within seconds.

---

## Small and Fast ⚡

Speed and performance have been a primary design goal for Git. Therefore, it is fast and small. Almost all git operations are done locally, which makes it so much faster than talking to a server all the time.

Below[^1] is a comparison of Git and SVN for the same operation using a server with no load and a gigabit internet connection to the client machine. This makes it an ideal best-case scenario for SVN while it mostly doesn't affect Git at all. (SVN is another popular version control system that is centralized.)

| Operation         | Description                                            | Git  | SVN   | Performance Difference |
|-------------------|--------------------------------------------------------|------|-------|------------------------|
| Commit Files (A)   | Add, commit and push 113 modified files (2164+, 2259-) | 0.64 | 2.60  | 4x                     |
| Commit Images (B)  | Add, commit and push a thousand 1 kB images            | 1.53 | 24.70 | 16x                    |
| Diff Current       | Diff 187 changed files (1664+, 4859-) against last commit | 0.25 | 1.09  | 4x                     |
| Diff Recent        | Diff against 4 commits back (269 changed/3609+, 6898-) | 0.25 | 3.99  | 16x                    |
| Diff Tags          | Diff two tags against each other (v1.9.1.0/v1.9.3.0)  | 1.17 | 83.57 | 71x                    |
| Log (50)           | Log of the last 50 commits (19 kB of output)           | 0.01 | 0.38  | 31x                    |
| Log (All)          | Log of all commits (26,056 commits – 9.4 MB of output) | 0.52 | 169.20| 325x                   |
| Log (File)         | Log of the history of a single file (array.c – 483 revs) | 0.60 | 82.84 | 138x                   |
| Update             | Pull of Commit A scenario (113 files changed, 2164+, 2259-) | 0.90 | 2.82  | 3x                     |
| Blame              | Line annotation of a single file (array.c)             | 1.91 | 3.04  | 1x                     |

---

## Distributed 🌍

Git is a distributed version control system. That means every developer on the project has a clone of the entire history of the repository instead of just seeing the latest version and editing it. This means that every developer has a local backup of the project, creating a very robust system against server failures or data corruption (or just mistakes).

Thanks to Git being distributed and having a branching system, many workflows for software development can be implemented regardless of project size. All images below are taken from git's official website[^2]:

### SVN-Style Workflow 🛠️

![SVN-Style Workflow](https://git-scm.com/images/about/workflow-a@2x.png)

This workflow is very common in small projects where every developer just contributes to a shared repository. Since Git doesn't allow you to commit to a repository unless you have the latest version, this system works fine.

### Integration Manager Workflow 📥

![Integration Manager Workflow](https://git-scm.com/images/about/workflow-b@2x.png)

This workflow is very common in teams where there is one lead person responsible for integration. This person decides when a particular branch will be merged with the main repository and can approve or deny certain developments.

### Dictator and Lieutenants Workflow 👑

![Dictator and Lieutenants Workflow](https://git-scm.com/images/about/workflow-c@2x.png)

Dictator and Lieutenants Workflow is more suitable for very large projects with many parallel developments and much more people. In this workflow, 'lieutenants' each act as a project manager from the previous workflow, and a 'dictator' works as a project manager for lieutenants. As you can see, the distributed nature of git allows for infinite scaling when managing a project.

---

## Data Assurance 🔒

Git's data model ensures **cryptographic integrity** by checksumming every file and commit, guaranteeing that you always retrieve the exact data you put in. Any changes to files, commit messages, or timestamps alter the IDs of subsequent commits, ensuring that a specific commit ID represents an untampered project history. This level of data assurance is not typically provided by centralized version control systems.

---

## Git Cheat Sheet 📝

| Git Command                     | Description                                                                                          |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| `git init <directory>`           | Create an empty Git repo in the specified directory. Run with no arguments to initialize the current directory as a Git repository. |
| `git clone <repo>`               | Clone repo located at `<repo>` onto local machine. Original repo can be located on the local filesystem or on a remote machine via HTTP or SSH. |
| `git config user.name <name>`    | Define author name to be used for all commits in the current repo. Devs commonly use `--global` flag to set config options for the current user. |
| `git add <directory>`            | Stage all changes in `<directory>` for the next commit. Replace `<directory>` with a `<file>` to stage a specific file. |
| `git commit -m "<message>"`      | Commit the staged snapshot, but instead of launching a text editor, use `<message>` as the commit message. |
| `git status`                     | List which files are staged, unstaged, and untracked.                                                |
| `git log`                        | Display the entire commit history using the default format. For customization, see additional options. |
| `git diff`                       | Show unstaged changes between your index and working directory.                                      |
| `git commit --amend`             | Replace the last commit with the staged changes and the last commit combined. Use with nothing staged to edit the last commit’s message. |
| `git rebase <base>`              | Rebase the current branch onto `<base>`. `<base>` can be a commit ID, branch name, a tag, or a relative reference to `HEAD`. |
| `git reflog`                     | Show a log of changes to the local repository’s `HEAD`. Add `--relative-date` flag to show date info or `--all` to show all references. |
| `git branch`                     | List all branches in your repo. Add a `<branch>` argument to create a new branch with the name `<branch>`. |
| `git checkout -b <branch>`       | Create and check out a new branch named `<branch>`. Drop the `-b` flag to check out an existing branch. |
| `git merge <branch>`             | Merge `<branch>` into the current branch.                                                            |
| `git revert <commit>`            | Create a new commit that undoes all the changes made in `<commit>`, then apply it to the current branch. |
| `git reset <file>`               | Remove `<file>` from the staging area, but leave the working directory unchanged. This unstages a file without overwriting any changes. |
| `git clean -n`                   | Shows which files would be removed from the working directory. Use the `-f` flag instead of the `-n` flag to execute the clean. |
| `git remote add <name> <url>`    | Create a new connection to a remote repo. After adding a remote, you can use `<name>` as a shortcut for `<url>` in other commands. |
| `git fetch <remote> <branch>`    | Fetches a specific `<branch>` from the repo. Leave off `<branch>` to fetch all remote references.    |
| `git pull <remote>`              | Fetch the specified remote's copy of the current branch and immediately merge it into the local copy. |
| `git push <remote> <branch>`     | Push the branch to `<remote>`, along with necessary commits and objects. Creates the named branch in the remote repo if it doesn't exist. |

---

### Footnotes

[^1]: [Git Small and Fast](https://git-scm.com/about/small-and-fast)  
[^2]: [Git Distributed](https://git-scm.com/about/distributed)
