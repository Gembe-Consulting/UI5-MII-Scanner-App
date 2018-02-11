sap.ui.define([
	"com/mii/scanner/model/formatter"
], function(formatter) {
	"use strict";

	QUnit.module("Test formatter function 'isEmptyStorageUnit(sQuantity)'", {});

	QUnit.test("Should detect '0.0' as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "0.0";
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should detect '0.001' as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "0.001";
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should detect 0.0 as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = 0.0;
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should detect 0.001 as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = 0.001;
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});

	QUnit.test("Should detect '' as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "";
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should detect null as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = null;
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should detect undefined as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity;
		//System under Test + Act
		assert.ok(formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is considered as empty storage unit");
	});
	
	QUnit.test("Should not detect '0.002' as empty storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "0.002";
		//System under Test + Act
		assert.ok(!formatter.isEmptyStorageUnit(sQuantity), sQuantity + " is not considered as empty storage unit");
	});


	QUnit.module("Test formatter function 'isFullStorageUnit(sQuantity)'", {});

	QUnit.test("Should detect '1.0' as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "1.0";
		//System under Test + Act
		assert.ok(formatter.isFullStorageUnit(sQuantity), sQuantity + " is considered as full storage unit");
	});
	
	QUnit.test("Should detect '1.001' as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "1.001";
		//System under Test + Act
		assert.ok(formatter.isFullStorageUnit(sQuantity), sQuantity + " is considered as full storage unit");
	});

	QUnit.test("Should detect 0.01 as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = 0.01;
		//System under Test + Act
		assert.ok(formatter.isFullStorageUnit(sQuantity), sQuantity + " is considered as full storage unit");
	});

	QUnit.test("Should not detect '0.001' as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "0.001";
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});

	QUnit.test("Should not detect 0.001 as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = 0.001;
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});

	QUnit.test("Should not detect '0.0' as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "0.0";
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});

	QUnit.test("Should not detect 0.0 as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = 0.0;
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});
	
	QUnit.test("Should not detect null as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = null;
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});

	QUnit.test("Should not detect undefined as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity;
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});

	QUnit.test("Should not detect '' as full storage unit", 1, function(assert) {
		//Arrange
		var sQuantity = "";
		//System under Test + Act
		assert.ok(!formatter.isFullStorageUnit(sQuantity), sQuantity + " is not considered as full storage unit");
	});
});