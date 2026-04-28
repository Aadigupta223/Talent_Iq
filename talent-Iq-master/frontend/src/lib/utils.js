export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};

// this badges are inbuilt in daisyUI
// badge-success => green
// badge-warning => yellow
// badge-error => red
// badge-ghost => gray