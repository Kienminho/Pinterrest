const Utils = require("../../common/Utils");
const _Category = require("../../model/Category");

const HandleGetAllsCategories = async (req, res) => {
  try {
    const { pageIndex, pageSize } = req.query;
    const categories = await _Category.find({ IsDeleted: false });

    const data = categories
      .slice((pageIndex - 1) * pageSize, pageSize)
      .sort((a, b) => b.CreatedAt - a.CreatedAt);

    res.json(Utils.createSuccessResponseModel(categories.length, data));
  } catch (error) {
    console.log(
      "CategoryController -> HandleGetAllsCategories: " + error.message
    );
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const HandleCreateCategory = async (req, res) => {
  try {
    const { listCategory } = req.body;

    const newCategory = await CreateCategory(listCategory);

    res.json(Utils.createSuccessResponseModel(0, newCategory.Index));
  } catch (error) {
    console.log("PostController -> HandleCreateCategory: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};

const CreateCategory = async (listCategory) => {
  let newCategory;
  for (const categoryData of listCategory) {
    newCategory = new _Category(categoryData);
    const lastCategory = await _Category.findOne(
      {},
      {},
      { sort: { Index: -1 } }
    );
    if (lastCategory) {
      newCategory.Index = lastCategory.Index + 1;
    } else {
      newCategory.Index = 0; // Set initial index if no categories exist
    }
    await newCategory.save();
  }
  return newCategory;
};

module.exports = {
  HandleGetAllsCategories: HandleGetAllsCategories,
  HandleCreateCategory: HandleCreateCategory,
  CreateCategory: CreateCategory,
};
