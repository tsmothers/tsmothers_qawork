//'use strict';

// Destruct objects from includes file
const {assert, test, BasePage, Builder, By, until} = require('../core/includes.js');

// Initialize page object with debug mode
var basePage = new BasePage();

// Describe and build test
test.describe(basePage.site, function() {

	// Initialize test timeout
	this.timeout(300000);

	// Initialize passwords array
	let passwords = [];

	// Begin login test
	test.it('PassPack Login', function() {

		// Navigate to URL
		basePage.get('https://www.passpack.com/online');
		// Ensure login form is visible
		basePage.wait(until.elementIsVisible(basePage.findElementByCSS('#formx')), 5000).then(() => {
			// Find userID field
			basePage.findElementByCSS('input[type="text"]').then((userID) => {
				// Send userID
				userID.sendKeys(username);
			});
			// Find password field
			basePage.findElementByCSS('input[type="password"]').then((userID) => {
				// Send password
				userID.sendKeys(password);
			});
			// Find signIn button
			basePage.findElementByCSS('.btentry').then((signIn) => {
				// Click signIn button
				basePage.clickElement(signIn);
			});
		});
		// Wait for presence of black box element in the DOM
		basePage.wait(until.elementLocated(By.css('#welcomediv .sel')), 5000).then(() => {
			// Wait for black box element to be visible
			basePage.wait(until.elementIsVisible(basePage.findElementByCSS('#welcomediv .sel')), 5000).then((blackBox) => {
				// Click blackBox
				basePage.clickElement(blackBox);
			});
		});
		// Wait for packing key form to be visible
		basePage.wait(until.elementIsVisible(basePage.findElementByCSS('#formx')), 5000).then(() => {
			// Find the packing key field
			basePage.findElementByCSS('input[type="password"]').then((packingKey) => {
				// Send the packing key
				packingKey.sendKeys(packingKeyPassword);
			});
			// Find unpack button
			basePage.findElementByCSS('.btentry').then((unpack) => {
				// Click unpack button
				basePage.clickElement(unpack);
			});
		});
	}); // End login test
	// Begin password retrieval test
	test.it('PassPack - Return Info', function() {
		// Initialize getPageRecords
		function getPageRecords() {
			// Initilize new promise
			return new Promise(function(resolve, reject) {
				// Wait for password rows to be located in the DOM
				basePage.wait(until.elementLocated(By.css('#allRows')), 5000).then(() => {
					// Wait for password rows to be visible
					basePage.wait(until.elementIsVisible(basePage.findElementByCSS('#allRows')), 5000).then(() => {
						// Find and store all password rows
						basePage.findElements(By.css('#allRows .row .val')).then(async function(rows) {
							// Initialize for loop of password rows
							for (i = 0; i < rows.length; i++) {
								// Set passwordName
								let passwordName = await rows[i].getText();
								// Create password object
								let password = {
									"name": passwordName,
									"sharing": []
								};
								// Click password row
								basePage.clickElement(rows[i]);
								// Set sharing tab element
								let sharingButton = await basePage.findElementByCSS('#formp #t_sharing');
								// Click sharing tab element
								basePage.clickElement(sharingButton);
								// Locate all checked users for sharing
								basePage.findElementByCSS('#formp #shareblock').findElements(By.css('.item .altCheckOn')).then(async function(sharedList) {
									// Initialize for loop of shared user list
									for (j = 0; j < sharedList.length; j++) {
										// Set sharedName
										let sharedName = await sharedList[j].getText();
										// Push shared names into the password object
										password.sharing.push(sharedName);

									} // End for loop of shared user list
									// Push the password object into the passwords array
									passwords.push(password);
								});
								// Set the cancel button element
								let cancel = await basePage.findElementByCSS('#cancelEntry');
								// Click cancel
								basePage.clickElement(cancel);
							} // End for loop of password rows
							// Initialize psudo array to determine existence of nextPageButton
							basePage.findElements(By.css('.next')).then(async function(nextPageButton) {
								// Store the href value attached to the next page button
								let href = await nextPageButton[0].getAttribute('href');
								// Initialize if nextPageButton & href === #
								if (nextPageButton.length === 1 && href === 'https://www.passpack.com/online/#') {
									// Click nextPageButton
									basePage.clickElement(nextPageButton[0]);
									// Resolve with promise chain
									resolve(getPageRecords());
								} else {
									// Resolve
									resolve();
								} // End if nextPageButton & href === #
							});
						});
					});
				});
			}); // End new promise
		}; // End getPageRecords
		// Wait for a DOM visible element
		basePage.wait(until.elementLocated(By.css('.next')), 5000).then(() => {
			// Wait for a visible element
			basePage.wait(until.elementIsVisible(basePage.findElementByCSS('.next')), 5000).then(async function() {
				// Await result of password retrieval
				await getPageRecords();
				// Output JSON stringified results of passwords array
				console.log(JSON.stringify(passwords));

			});
		});
	}); // End password retrieval test
});
