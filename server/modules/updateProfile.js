module.exports.updateInformation = function (Model, typeOf, req, res) {
    Model.findByIdAndUpdate(typeOf._id, req.body, { new: true })
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: err.name })
        })
}
