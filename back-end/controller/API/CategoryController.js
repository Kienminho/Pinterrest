const Utils = require("../../common/Utils");
const _Category = require("../../model/Category");

const HandleGetAllsCategories = async (req, res) => {
  try {
    const { keyword, pageIndex, pageSize } = req.query;
    const pipeline = [
      {
        $match: {
          $or: [
            { Name: { $regex: keyword, $options: "i" } },
            { Description: { $regex: keyword, $options: "i" } },
          ],
          IsDeleted: false,
        },
      },
      {
        $sort: { CreatedAt: -1 }, // Sort by CreatedAt in descending order
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [
            { $skip: (parseInt(pageIndex) - 1) * parseInt(pageSize) },
            { $limit: parseInt(pageSize) },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          data: 1,
        },
      },
    ];

    const result = await _Category.aggregate(pipeline);

    const totalCount = result[0]?.totalCount || 0;
    const data = result[0]?.data || [];
    res.json(Utils.createSuccessResponseModel(totalCount, data));
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

//private category
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

const HandleDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await _Category.findOne({ _id: id });
    if (!category) {
      return res
        .status(400)
        .json(Utils.createErrorResponseModel("Category not found"));
    }
    category.IsDeleted = true;
    await category.save();
    res.json(Utils.createSuccessResponseModel(0, true));
  } catch (error) {
    console.log("CategoryController -> HandleDeleteCategory: " + error.message);
    return res.status(500).json(Utils.createErrorResponseModel(error.message));
  }
};
module.exports = {
  HandleGetAllsCategories: HandleGetAllsCategories,
  HandleCreateCategory: HandleCreateCategory,
  CreateCategory: CreateCategory,
  HandleDeleteCategory: HandleDeleteCategory,
};
