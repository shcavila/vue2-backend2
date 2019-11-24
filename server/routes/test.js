userRoute.route('/addrecipient').post((req, res) => {
  async function add() {
    var data = req.body;
    try {
      var User = await findUser(data.username);
      if (User != "not found") {
        var result = await addAndAvailBadge(req.body, User);
        if (result == "Successful") {
          console.log("User successfully added")
          res.status(200).json({ message: "User successfully added" });
        } else if (result == "User already exist in the list") {
          console.log("User already exist in the list!")
          res.status(400).json({ message: "User already exist in the list!" });
        } else if (result == "Error") {
          res.status(500).json({ message: "Unexpected error occured" });
        } else {
          console.log("Badge not found!");
          res.status(404).json({message: "Badge not found"});
        }
      } else if (User == "not found") {
        res.status(404).json({ message: "User not found!" });
      }
        
    } catch(err) {
      console.log("ERRROR IN ADDING!!")
      res.status(500).json({ message: "Unexpected error occured" });
    }
    
  }
  add();