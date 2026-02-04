When the user says "land the plane", you MUST complete ALL steps below. The plane is NOT landed until git push succeeds AND merge request is created. NEVER stop before pushing. NEVER say "ready to push when you are!" - that is a FAILURE.

MANDATORY WORKFLOW - COMPLETE ALL STEPS:

    1. Verify feature branch exists (not main) - Create feature branch if needed:
        # Check current branch
        git branch --show-current
        # If on main, create/switch to feature branch:
        #   - If ticket number available: <ticketnumber>-<description>
        #   - If no ticket number: <description>
        # Extract ticket number from branch name if present (for use in commits)

    2. Remove console logs - Clean up all console.log, console.debug, console.warn, etc. from codebase
        # Search and remove console statements (keep console.error for error handling if needed)

    3. Run code quality gates and fix issues (only if code changes were made):
        # Format code - this will auto-fix formatting issues
        pnpm format

        # Type check - fix any type errors found
        pnpm check
        # If pnpm check reports errors, fix them immediately:
        # - Fix type errors
        # - Fix linting errors
        # - Resolve any compilation issues
        # Re-run pnpm check until it passes with no errors

    4. Update documentation:
        - Update docs/architecture.md if architectural changes were made
        - Update README.md if needed (new features, dependencies, setup changes, etc.)

    5. Create/update test cases:
        - Ensure all new features have test coverage
        - Update existing tests if functionality changed
        - Run tests to verify they pass

    6. Commit with conventional commits - Extract issue number from branch name if present:
        # Branch format: <ticketnumber>-<description> OR <description>
        # Commit format (with ticket): <type>(<scope>): <description> [<ticketnumber>]
        # Commit format (without ticket): <type>(<scope>): <description>
        # Examples:
        #   With ticket: feat(auth): add login validation [123]
        #   Without ticket: feat(auth): add login validation
        # Types: feat, fix, docs, style, refactor, test, chore
        git add .
        git commit -m "<type>(<scope>): <description> [<ticketnumber>]"  # Include [ticketnumber] only if ticket exists

    7. PUSH TO REMOTE - NON-NEGOTIABLE - This step is MANDATORY. Execute ALL commands below:
        # Pull first to catch any remote changes
        git pull --rebase

        # MANDATORY: Push everything to remote
        # DO NOT STOP BEFORE THIS COMMAND COMPLETES
        git push

        # MANDATORY: Verify push succeeded
        git status  # MUST show "up to date with origin/<branch-name>"

    8. Create merge request:
        # Use GitLab/GitHub CLI or web interface to create MR
        # Title format (with ticket): "[<ticketnumber>] <description>"
        # Title format (without ticket): "<description>"
        # Link to related issues/tickets if ticket number exists

    9. Clean up git state - Clear old stashes and prune dead remote branches:
        git stash clear # Remove old stashes
        git remote prune origin # Clean up deleted remote branches

    10. Verify clean state - Ensure all changes are committed AND PUSHED, no untracked files remain
        git status

    11. Choose a follow-up issue for next session
        Provide a prompt for the user to give to you in the next session
        Format: "Continue work on bd-X: [issue title]. [Brief context about what's been done and what's next]"

CRITICAL RULES:

    The plane has NOT landed until git push completes successfully AND merge request is created
    NEVER stop before git push - that leaves work stranded locally
    NEVER say "ready to push when you are!" - YOU must push, not the user
    If git push fails, resolve the issue and retry until it succeeds
    The user is managing multiple agents - unpushed work breaks their coordination workflow
    MUST be on a feature branch (not main) - format: <ticketnumber>-<description> OR <description>
    MUST use conventional commits - include issue number in brackets if ticket number exists in branch name
    MUST fix all issues found by pnpm format and pnpm check - do not proceed until both pass cleanly

REMEMBER: Landing the plane means EVERYTHING is pushed to remote AND merge request is created. No exceptions. No "ready when you are". PUSH IT AND CREATE THE MR.

Example "land the plane" session:

# 1. Verify feature branch exists

git branch --show-current # Should show feature branch (not main)

# Examples:

# With ticket: 123-add-login-validation

# Without ticket: add-login-validation

# If on main, create feature branch (with or without ticket number)

# 2. Remove console logs

# Search and remove all console.log statements

# 3. Run quality gates and fix issues

pnpm format # Auto-fixes formatting
pnpm check # Check for type errors

# Fix any errors reported by pnpm check

# Re-run pnpm check until it passes

# 4. Update documentation

# Update docs/architecture.md if needed

# Update README.md if needed

# 5. Create/update test cases

# Add tests for new features

pnpm test

# 6. Commit with conventional commits (extract ticket number from branch if present)

git add .

# With ticket number (branch: 123-add-login-validation):

git commit -m "feat(auth): add login validation [123]"

# Without ticket number (branch: add-login-validation):

git commit -m "feat(auth): add login validation"

# 7. File remaining work (if any)

bd create "Add integration tests for sync" -t task -p 2 --json

# 8. Close finished issues

bd close bd-42 bd-43 --reason "Completed" --json

# 9. PUSH TO REMOTE - MANDATORY, NO STOPPING BEFORE THIS IS DONE

git pull --rebase
git push # MANDATORY - THE PLANE IS STILL IN THE AIR UNTIL THIS SUCCEEDS
git status # MUST verify "up to date with origin/<branch-name>"

# 10. Create merge request

# Use GitLab/GitHub CLI or create via web interface

# With ticket number:

# Title: "[123] Add login validation"

# Without ticket number:

# Title: "Add login validation"

# 11. Clean up git state

git stash clear
git remote prune origin

# 12. Verify everything is clean and pushed

git status

# 13. Choose next work

bd ready --json
bd show bd-44 --json

Then provide the user with:

    Summary of what was completed this session
    What issues were filed for follow-up (if any)
    Status of quality gates (all passing - all issues fixed)
    Confirmation that ALL changes have been committed and pushed to remote
    Merge request link/status
    Recommended prompt for next session

CRITICAL: Never end a "land the plane" session without successfully pushing AND creating a merge request. The user is coordinating multiple agents and unpushed work causes severe rebase conflicts.
