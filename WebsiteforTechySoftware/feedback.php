<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus Info Tech</title>
    <link rel="icon" href="images/icon11.png">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
<?php
$name = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];

if(!empty($name) && !empty($email) && !empty($message)){
    $host="localhost";
    $dbuser="root";
    $dbpassword="";
    $dbname="logindetails";

    $conn = new mysqli($host,$dbuser,$dbpassword,$dbname);
    if(mysqli_connect_error()){
        die("connect error(".mysqli_connect_errno().")".mysqli_connect_error());
    } else {
        $INSERT ="INSERT into feedback (name,email,message) values(?,?,?)";
        $stmt = $conn->prepare($INSERT);
        $stmt->bind_param("sss",$name,$email,$message);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        ?>
        <script>
            swal({
                title: "Thanks for the feedback",
                text: "Feedback submitted successfully",
                icon: "success",
                button: "OK"
            }).then(function() {
                window.location = "index.html";
            });
        </script>
        <?php
    }
} else {
    echo "All fields are required";
    die();
}
?>
</body>
</html>
