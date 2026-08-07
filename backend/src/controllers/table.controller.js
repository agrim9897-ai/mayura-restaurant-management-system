import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as tableService from "../services/table.service.js";

export const getTables = asyncHandler(async (req, res) => {
  const tables = await tableService.getAllTables(req.query);
  const stats = await tableService.getTableOccupancyStats();

  res.status(200).json(
    new ApiResponse(
      200,
      { tables, stats },
      "Tables and occupancy statistics fetched successfully"
    )
  );
});

export const getTableById = asyncHandler(async (req, res) => {
  const table = await tableService.getTableById(req.params.id);
  if (!table) {
    return res.status(404).json(new ApiResponse(404, null, "Table not found"));
  }
  res.status(200).json(new ApiResponse(200, table, "Table details fetched successfully"));
});

export const createTable = asyncHandler(async (req, res) => {
  const { tableNumber, capacity } = req.body;
  if (!tableNumber || !capacity) {
    return res.status(400).json(new ApiResponse(400, null, "Table number and capacity are required"));
  }

  const table = await tableService.createTable(req.body);
  res.status(201).json(new ApiResponse(201, table, "Table created successfully"));
});

export const updateTable = asyncHandler(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, table, "Table updated successfully"));
});

export const deleteTable = asyncHandler(async (req, res) => {
  await tableService.deleteTable(req.params.id);
  res.status(200).json(new ApiResponse(200, null, "Table deleted successfully"));
});
