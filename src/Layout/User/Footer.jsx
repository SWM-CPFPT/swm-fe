import "../../assets/Footer.css";

export default function Footer() {
  return (
    <>
      <footer>
        <div class="footer" style={{ background: "#57412B" }}>
          <div class="row dl-flex">
            <ul style={{ padding: 0 }}>
              <li>
                <a href="#" style={{ color: "white" }}>
                  <i class="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  <i class="fa fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  <i class="fa fa-youtube"></i>
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  <i class="fa fa-twitter"></i>
                </a>
              </li>
            </ul>
          </div>

          <div class="row">
            <ul style={{ padding: 0 }}>
              <li>
                <a href="#" style={{ color: "white" }}>
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  Our Services
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "white" }}>
                  Career
                </a>
              </li>
            </ul>
          </div>

          <div class="row">
            <p
              style={{
                textAlign: "center",
                color: "white",
                fontSize: "20px",
                padding: 0,
              }}
            >
              Thanks for visiting out website. Hope you have a great enjoy
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
