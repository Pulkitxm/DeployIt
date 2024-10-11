import { VIEW_MODE, SORT_ORDER } from "@/types/project";

export const localValues: {
  viewMode: VIEW_MODE;
  searchTerm: string;
  sortOrder: SORT_ORDER;
} = {
  viewMode: VIEW_MODE.grid,
  searchTerm: "",
  sortOrder: SORT_ORDER.most_recent,
};

if (localStorage.getItem("viewMode")) {
  if (
    Object.values(VIEW_MODE).includes(
      localStorage.getItem("viewMode") as VIEW_MODE,
    )
  ) {
    localValues.viewMode = localStorage.getItem("viewMode") as VIEW_MODE;
  }
}
if (localStorage.getItem("searchTerm")) {
  localValues.searchTerm = localStorage.getItem("searchTerm") as string;
}
if (localStorage.getItem("sortOrder")) {
  if (
    Object.values(SORT_ORDER).includes(
      localStorage.getItem("sortOrder") as SORT_ORDER,
    )
  ) {
    localValues.sortOrder = localStorage.getItem("sortOrder") as SORT_ORDER;
  }
}
