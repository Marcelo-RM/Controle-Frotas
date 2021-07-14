sap.ui.define([
	"./BaseController",
	"sap/m/MessagePopover",
	"sap/m/Link",
	"sap/m/MessagePopoverItem",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/ui/core/syncStyleClass",
	"sap/m/library"
], function (BaseController, MessagePopover, Link, MessagePopoverItem,
	MessageToast, Device, syncStyleClass, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.VerticalPlacementType
	var VerticalPlacementType = mobileLibrary.VerticalPlacementType;

	return BaseController.extend("project.frotasapp.controller.App", {

		_bExpanded: true,

		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
			if (Device.resize.width <= 1024) {
				this.onSideNavButtonPress();
			}

			Device.media.attachHandler(function (oDevice) {
				if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
					this.onSideNavButtonPress();
					// set the _bExpanded to false on tablet devices
					// extending and collapsing of side navigation should be done when resizing from
					// desktop to tablet screen sizes)
					this._bExpanded = (oDevice.name === "Desktop");
				}
			}.bind(this));

			this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));
		},

		onRouteChange: function (oEvent) {
			this.getModel("side").setProperty("/selectedKey", oEvent.getParameter("name"));

			if (Device.system.phone) {
				this.onSideNavButtonPress();
			}
		},

		onSideNavButtonPress: function () {
			var oToolPage = this.byId("app");
			var bSideExpanded = oToolPage.getSideExpanded();
			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bSideExpanded) {
			var oToggleButton = this.byId("sideNavigationToggleButton");
			this.getBundleText(bSideExpanded ? "expandMenuButtonText" : "collpaseMenuButtonText").then(function (sTooltipText) {
				oToggleButton.setTooltip(sTooltipText);
			});
		},

		// Errors Pressed
		onMessagePopoverPress: function (oEvent) {
			var oMessagePopoverButton = oEvent.getSource();
			if (!this.byId("errorMessagePopover")) {
				this.getModel("i18n").getResourceBundle().then(function (oBundle) {
					var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
						placement: VerticalPlacementType.Bottom,
						items: {
							path: "alerts>/alerts/errors",
							factory: this._createError.bind(this, oBundle)
						},
						afterClose: function () {
							oMessagePopover.destroy();
						}
					});
					this.byId("app").addDependent(oMessagePopover);
					// forward compact/cozy style into dialog
					syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oMessagePopover);
					oMessagePopover.openBy(oMessagePopoverButton);
				}.bind(this));
			}
		},

		_createError: function (oBundle, sId, oBindingContext) {
			var oBindingObject = oBindingContext.getObject();
			var oLink = new Link("moreDetailsLink", {
				text: oBundle.getText("moreDetailsButtonText"),
				press: function (oEvent) {
					this.getBundleText("clickHandlerMessage", [oEvent.getSource().getText()]).then(function (sClickHandlerMessage) {
						MessageToast.show(sClickHandlerMessage);
					});
				}.bind(this)
			});

			var oMessageItem = new MessagePopoverItem({
				title: oBindingObject.title,
				subtitle: oBindingObject.subTitle,
				description: oBindingObject.description,
				counter: oBindingObject.counter,
				link: oLink
			});
			return oMessageItem;
		},

		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
		getBundleText: function (sI18nKey, aPlaceholderValues) {
			return this.getBundleTextByModel(sI18nKey, this.getModel("i18n"), aPlaceholderValues);
		}

	});
});