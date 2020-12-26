
const js = `
const multiSplit = (str, delimeters) => {
  let right = str
  const result = []

  for (let i = 0; i < delimeters.length; i++) {
    const indexDel = right.indexOf(delimeters[i])
    if (indexDel === -1) continue
    result.push(right.slice(0, indexDel))
    right = right.slice(indexDel + 1)
  }

  result.push(right)

  return result
}
`
const css = `
background-color: #fff;
position: absolute;
top: 100%;
right: 5px;
width: 320px;
display: "block";
transition: all 0.5s;
border-radius: 0 0 5px 5px;
overflow: hidden;
z-index: 6;
box-shadow: 0 4px 15px rgba(15, 16, 22, 0.1);
.radioButton {
  background-color: #fff;
  border-radius: 50%;
}
.margin {
  margin-top: 19px;
}
.btn {
  padding: 0 20px;
  margin: 10px 0;
}
.bonus-checkbox {
  padding: 20px 25px;
  .checkbox {
    background-color: #fff;
  }
  .text {
    font-size: 0.933em;
    line-height: 1.45;
  }
}
`
const rust = `
#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();

    let listen_port = std::env::var("LISTEN_PORT").expect("LISTEN_PORT");
    let listen_host = std::env::var("LISTEN_HOST").expect("LISTEN_HOST");
    let connection_url = std::env::var("DATABASE_URL").expect("DATABASE_URL");
    let is_dev = std::env::var("DEV").map(|d| d != "false").unwrap_or(false);

    let sg_api_key = std::env::var("SG_API_KEY").expect("SG_API_KEY");
    let sg_application_host = std::env::var("SG_APPLICATION_HOST").expect("SG_APPLICATION_HOST");
    let sg_email_confirm_url_prefix =
        std::env::var("SG_EMAIL_CONFIRM_URL_PREFIX").expect("SG_EMAIL_CONFIRM_URL_PREFIX");
    let sg_email_confirm_template =
        std::env::var("SG_EMAIL_CONFIRM_TEMPLATE").expect("SG_EMAIL_CONFIRM_TEMPLATE");
    let sg_sender_email = std::env::var("SG_SENDER_EMAIL").expect("SG_SENDER_EMAIL");

    let bind_address = format!("{host}:{port}", host = listen_host, port = listen_port);

    if is_dev {
        println!("==> api-internal runned in DEVELOPMENT MODE");
    } else {
        println!("==> PRODUCTION MODE in api-internal");
    }
`

const java = `
import java.util.Scanner;
public class percentage_calculator {

    public static void main(String[] args) {

Scanner sc = new Scanner(System.in);
        System.out.println("enter marks in hindi");
        float Hindi = sc.nextFloat();
        System.out.println("enter marks in english");
        float English = sc.nextFloat();
        System.out.println("enter marks in maths");
        float Maths = sc.nextFloat();
        System.out.println("enter marks in science");
        float Science = sc.nextFloat();
        System.out.println("enter marks sst");
        float SSt = sc.nextFloat();
float Total = Hindi+English+Maths+Science+SSt;
        System.out.println("Total marks obtained ="+Total);
float CGPA = Total/5;
        System.out.println("CGPA =" +CGPA);
float Percentage = (float) (9.5 * CGPA);
        System.out.println(" Percentage obtained = " + Percentage);



    }
}
`

const shell = `
#!/usr/bin/env bash

myscript () {
    typeset a i k;

    # setup cmd; declare functions
    for i in "\${!g_@}"; do
        typeset -n j=$i;
        typeset "action_\${!j}";
        for k in \${j}; do
            #danger?
            . /dev/fd/0 <<< "function \${k} () {
                readonly action_\${!j}=$k 2>/dev/null || {
                    printf 'error: use only one cmd of: %s\n' '"$j"' 1>&2;
                    return 1;
                };
            }";
        done;
    done;

    # setup options
    :;

    # parse args
    for a; do
        if
            typeset -F "$a" 1>/dev/null 2>&1;
        then
            "$a" && unset -f a || return 1;
        else
            echo unkown cmd ... 2>&1;
            return 1;
        fi;
    done;

    for i in "\${!action_@}"; do
        typeset -n j=$i;
        printf '%s: %s\n' "\${!j}" "$j";
    done;
};

export \
    g_1='create remove' \
    g_2='modify';

echo test 1:
'myscript' create modify remove;

echo test 2:
'myscript' create modify;
`

export default [js, css, rust, java, shell]