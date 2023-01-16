function wtsp2readable(temp) {
  if (!temp || !temp.data[0]) return {};

  var tempBody = temp.data[0];
  temp.data.forEach((tempLanguage) => {
    if (tempLanguage.language === "en" || tempLanguage.language === "en_US") {
      tempBody = tempLanguage;
    }
  });
  var template = { name: tempBody.name };
  tempBody.components.forEach((element) => {
    if (element.type === "HEADER") {
      template.header = { type: element.format };
    }
    if (element.type === "BODY") {
      template.body = { text: element.text };
    }
    if (element.type === "FOOTER") {
      template.footer = { text: element.text };
    }
  });
  return template;
}

function readable2wtsp(data) {
  const template = {};
  template.name = data.name;
  template.category = "TRANSACTIONAL";
  template.components = data.components;
  template.language = data.language;
  return template;
}

module.exports = { readable2wtsp, wtsp2readable };
