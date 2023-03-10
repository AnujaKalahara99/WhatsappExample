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

//To Convert to DB friendly format
function fillTemplateVariables(components, headerVar, bodyVar) {
  const template = {};
  components.forEach((com) => {
    if (com.type === "HEADER") {
      if (com.format === "TEXT")
        template.header = {
          type: com.format.toLowerCase(),
          data: stringReplace(com.text, /({{\d+}})/g, headerVar),
        };
      else
        template.header = {
          type: com.format.toLowerCase(),
          data: headerVar[0],
        };
    } else if (com.type === "BODY") {
      template.body = stringReplace(com.text, /({{\d+}})/g, bodyVar);
    } else if (com.type === "FOOTER") {
      template.footer = com.text;
    }
  });
  return template;

  function stringReplace(text, search, replaceWith) {
    let parsedText = "";
    const pieces = text
      .split(search)
      .filter((t) => !new RegExp(search).test(t));
    if (pieces.length < 2) return text;
    for (let i = 0; i < pieces.length - 1; i++) {
      let joinWith = "";
      if (replaceWith && replaceWith.length > i)
        joinWith = replaceWith[i] ? replaceWith[i] : joinWith;
      const joined = pieces[i] + joinWith;
      parsedText += joined;
    }

    parsedText += pieces[pieces.length - 1];
    return parsedText;
  }
}

module.exports = { readable2wtsp, wtsp2readable, fillTemplateVariables };
