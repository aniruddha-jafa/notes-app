function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getHome = () => {}

exports.notesReadOne = () => {}

exports.notesReadMany = async (req, res, next) => {
  try {
    await waitFor(1500)
    res.json({ message: 'notesReadMany mock response' })
  } catch (err) {
    next(err)
  }
}
exports.notesCreateOne = () => {}

exports.noteController = () => {}

exports.notesUpdateOne = () => {}

exports.notesDeleteOne = () => {}
