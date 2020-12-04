import { Homepage, HomepageItem } from "../models/homepage";

function getDefaultHomepage(): Homepage {
  return {
    title: "Performance Dashboard",
    description:
      "The Performance Dashboard makes data open " +
      "and accessible to provide transparency and help drive the " +
      "ongoing improvement of digital services.",
    updatedAt: new Date(),
  };
}

function fromItem(item: HomepageItem): Homepage {
  return {
    title: item.title,
    description: item.description,
    updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  };
}

export default {
  getDefaultHomepage,
  fromItem,
};
