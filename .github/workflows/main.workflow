workflow "yarn-test" {
  on = "push"
  resolves = ["test"]
}

action "build" {
  uses = "nuxt/actions-yarn@master"
  args = "install"
}

action "test" {
  needs = "build"
  uses = "nuxt/actions-yarn@master"
  args = "test"
}