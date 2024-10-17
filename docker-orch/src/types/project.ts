export enum PROJECT_STATUS {
  BUILD_SUCCESS = "build_success",
  BUILD_FAILED = "build_failed",
  BUILD_PENDING = "build_pending",
  BUILD_IN_QUEUE = "build_in_queue",

  DELETE_PENDING = "delete_pending",
  DELETE_FAILED = "delete_failed",
  DELETE_SUCCESS = "delete_success",
  DELETE_IN_QUEUE = "delete_in_queue",

  BUILD_TIMEOUT = "build_timeout",
  DELETE_TIMEOUT = "delete_timeout",
}
