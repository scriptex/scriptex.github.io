(() => {
	function getPureProperty(rule, propertyName) {
		return rule.style.getPropertyValue(propertyName).trim().slice(1, -1);
	}

	function cjss(rules) {
		for (let rule of rules) {
			const ruleName = rule.constructor.name;

			if (ruleName === 'CSSImportRule') {
				const importedRules = rule.styleSheet.cssRules;

				cjss(importedRules);
			}

			if (ruleName === 'CSSStyleRule') {
				const selector = rule.style.parentRule.selectorText;
				const elements = document.querySelectorAll(selector);

				const js = getPureProperty(rule, '--js');
				const html = getPureProperty(rule, '--html');

				let data = getPureProperty(rule, '--data');

				if (data) {
					data = eval(`({ ${data} })`);
				}

				if (html) {
					for (let element of elements) {
						element.innerHTML = eval(`\`${html}\``);
					}
				}

				if (js) {
					if (selector === 'script') {
						eval(js);

						continue;
					}

					for (let n = 0; n < elements.length; n++) {
						eval(
							js.replace(
								/this/g,
								`document.querySelectorAll('${selector}')[${n}]`
							)
						);
					}
				}
			}
		}
	}

	import('https://www.googletagmanager.com/gtag/js?id=UA-83446952-2').then(
		() => {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push('js', new Date());
			window.dataLayer.push('config', 'UA-83446952-2');
		}
	);

	for (let sheet of document.styleSheets) {
		const rules = sheet.rules || sheet.cssRules;

		if (!rules || !rules.length) continue;

		cjss(rules);
	}
})();
