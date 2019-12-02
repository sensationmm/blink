workflow "Deploy to Firebase" {
  on = "push"
  resolves = ["Deploy"]
}

action "On master branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# action "Build" {
#   uses = "./.github/gatsby-build"
#   needs = ["On master branch"]
# }

action "Deploy" {
    #   needs = "Build"
  uses = "./deploy-action"
  secrets = ["FIREBASE_AUTH_TOKEN"]
  args = "--only hosting"
}