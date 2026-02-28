#!/bin/bash

# GitHub Labels Setup Script for Guardian Route
# Sprint 2 - Week 1
# Usage: ./scripts/setup-github-labels.sh

set -e

REPO="jetci/Guardian-Route"

echo "🏷️  Setting up GitHub Labels for $REPO..."

# Sprint Labels
gh label create "Sprint1" --color "0E8A16" --description "Sprint 1 tasks" --repo $REPO || echo "Label Sprint1 already exists"
gh label create "Sprint2" --color "1D76DB" --description "Sprint 2 tasks" --repo $REPO || echo "Label Sprint2 already exists"
gh label create "Sprint3" --color "5319E7" --description "Sprint 3 tasks" --repo $REPO || echo "Label Sprint3 already exists"

# Week Labels
gh label create "Week1" --color "FBCA04" --description "Week 1 tasks" --repo $REPO || echo "Label Week1 already exists"
gh label create "Week2" --color "FEF2C0" --description "Week 2 tasks" --repo $REPO || echo "Label Week2 already exists"
gh label create "Week3" --color "C5DEF5" --description "Week 3 tasks" --repo $REPO || echo "Label Week3 already exists"
gh label create "Week4" --color "BFD4F2" --description "Week 4 tasks" --repo $REPO || echo "Label Week4 already exists"

# Type Labels
gh label create "type:feature" --color "0075CA" --description "New feature" --repo $REPO || echo "Label type:feature already exists"
gh label create "type:bugfix" --color "D73A4A" --description "Bug fix" --repo $REPO || echo "Label type:bugfix already exists"
gh label create "type:refactor" --color "A2EEEF" --description "Code refactoring" --repo $REPO || echo "Label type:refactor already exists"
gh label create "type:documentation" --color "0075CA" --description "Documentation" --repo $REPO || echo "Label type:documentation already exists"
gh label create "type:testing" --color "D4C5F9" --description "Testing" --repo $REPO || echo "Label type:testing already exists"
gh label create "type:setup" --color "EDEDED" --description "Setup/Configuration" --repo $REPO || echo "Label type:setup already exists"
gh label create "type:admin" --color "EDEDED" --description "Administrative task" --repo $REPO || echo "Label type:admin already exists"

# Team Labels
gh label create "backend" --color "D93F0B" --description "Backend team" --repo $REPO || echo "Label backend already exists"
gh label create "frontend" --color "FBCA04" --description "Frontend team" --repo $REPO || echo "Label frontend already exists"
gh label create "ux" --color "E99695" --description "UX/UI team" --repo $REPO || echo "Label ux already exists"
gh label create "qa" --color "C2E0C6" --description "QA team" --repo $REPO || echo "Label qa already exists"

# Priority Labels
gh label create "priority:critical" --color "B60205" --description "Critical priority" --repo $REPO || echo "Label priority:critical already exists"
gh label create "priority:high" --color "D93F0B" --description "High priority" --repo $REPO || echo "Label priority:high already exists"
gh label create "priority:medium" --color "FBCA04" --description "Medium priority" --repo $REPO || echo "Label priority:medium already exists"
gh label create "priority:low" --color "0E8A16" --description "Low priority" --repo $REPO || echo "Label priority:low already exists"

# Status Labels
gh label create "status:blocked" --color "D73A4A" --description "Blocked by dependencies" --repo $REPO || echo "Label status:blocked already exists"
gh label create "status:in-progress" --color "FBCA04" --description "Work in progress" --repo $REPO || echo "Label status:in-progress already exists"
gh label create "status:review" --color "5319E7" --description "Ready for review" --repo $REPO || echo "Label status:review already exists"
gh label create "status:done" --color "0E8A16" --description "Completed" --repo $REPO || echo "Label status:done already exists"

echo "✅ GitHub Labels setup complete!"
