function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getHome = () => {}

exports.notesReadOne = () => {}

exports.notesReadMany = async (req, res, next) => {
  try {
    await waitFor(500)
    res.json({ message: 'notesReadMany mock response' })
  } catch (err) {
    next(err)
  }
}
exports.notesCreateOne = async (req, res, next) => {
  try {
    await waitFor(500)
    res.json({ message: 'notesCreateOne mock response' })
  } catch (err) {
    next(err)
  }
}

exports.noteController = () => {}

exports.notesUpdateOne = () => {}

exports.notesDeleteOne = () => {}
