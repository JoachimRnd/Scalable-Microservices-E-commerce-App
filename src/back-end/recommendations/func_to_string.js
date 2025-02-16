const path = require('path')
const fs = require('fs')
const viewsDir = path.join(__dirname, 'src/views')
const outDir = path.join(__dirname, 'formatter_output')
const log = require('debug')('views-formatter')

fs.readdir(viewsDir, (err, files) => {
  if (err) throw err
  files.forEach((file) => {
    var descriptor = require(`${viewsDir}/${file}`).viewDescriptor
    if (!descriptor.views || Object.keys(descriptor.views).length === 0) {
      log(`file [${viewsDir}/${file}] is ignored because there is not any view on it`)
    } else {
      var views = Object.keys(descriptor.views)
      views.map((view) => {
        if (descriptor.views[view].map) {
          descriptor.views[view].map = descriptor.views[view].map.toString();
        }
        if (descriptor.views[view].reduce) {
          descriptor.views[view].reduce = descriptor.views[view].reduce.toString();
        }
      });           
      var descriptorJson = JSON.stringify(descriptor);
      var descriptorBuffer = Buffer.from(descriptorJson, 'utf8');
      fs.writeFile(`${outDir}/${file}`, descriptorBuffer, (e) => {
        if (e) throw e
        log(`succesful creation of file [${outDir}/${file}]`)
      })
    }
  })
})
