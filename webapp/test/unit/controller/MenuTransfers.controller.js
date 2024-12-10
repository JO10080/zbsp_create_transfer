/*global QUnit*/

sap.ui.define([
	"zbspbz/zbsp_create_transfer/controller/MenuTransfers.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MenuTransfers Controller");

	QUnit.test("I should test the MenuTransfers controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
