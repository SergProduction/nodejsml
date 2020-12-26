"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var parse_1 = require("./parse");
var data_json_1 = __importDefault(require("../data.json"));
var checkDocJS = "\nconst multiSplit = (str, delimeters) => {\n  let right = str\n  const result = []\n\n  for (let i = 0; i < delimeters.length; i++) {\n    const indexDel = right.indexOf(delimeters[i])\n    if (indexDel === -1) continue\n    result.push(right.slice(0, indexDel))\n    right = right.slice(indexDel + 1)\n  }\n\n  result.push(right)\n\n  return result\n}\n";
var checkDocCss = "\nbackground-color: #fff;\nposition: absolute;\ntop: 100%;\nright: 5px;\nwidth: 320px;\ndisplay: \"block\";\ntransition: all 0.5s;\nborder-radius: 0 0 5px 5px;\noverflow: hidden;\nz-index: 6;\nbox-shadow: 0 4px 15px rgba(15, 16, 22, 0.1);\n.radioButton {\n  background-color: #fff;\n  border-radius: 50%;\n}\n.margin {\n  margin-top: 19px;\n}\n.btn {\n  padding: 0 20px;\n  margin: 10px 0;\n}\n.bonus-checkbox {\n  padding: 20px 25px;\n  .checkbox {\n    background-color: #fff;\n  }\n  .text {\n    font-size: 0.933em;\n    line-height: 1.45;\n  }\n}\n";
var checkDocRust = "\n#[actix_rt::main]\nasync fn main() -> std::io::Result<()> {\n    dotenv::dotenv().ok();\n    env_logger::init();\n\n    let listen_port = std::env::var(\"LISTEN_PORT\").expect(\"LISTEN_PORT\");\n    let listen_host = std::env::var(\"LISTEN_HOST\").expect(\"LISTEN_HOST\");\n    let connection_url = std::env::var(\"DATABASE_URL\").expect(\"DATABASE_URL\");\n    let is_dev = std::env::var(\"DEV\").map(|d| d != \"false\").unwrap_or(false);\n\n    let sg_api_key = std::env::var(\"SG_API_KEY\").expect(\"SG_API_KEY\");\n    let sg_application_host = std::env::var(\"SG_APPLICATION_HOST\").expect(\"SG_APPLICATION_HOST\");\n    let sg_email_confirm_url_prefix =\n        std::env::var(\"SG_EMAIL_CONFIRM_URL_PREFIX\").expect(\"SG_EMAIL_CONFIRM_URL_PREFIX\");\n    let sg_email_confirm_template =\n        std::env::var(\"SG_EMAIL_CONFIRM_TEMPLATE\").expect(\"SG_EMAIL_CONFIRM_TEMPLATE\");\n    let sg_sender_email = std::env::var(\"SG_SENDER_EMAIL\").expect(\"SG_SENDER_EMAIL\");\n\n    let bind_address = format!(\"{host}:{port}\", host = listen_host, port = listen_port);\n\n    if is_dev {\n        println!(\"==> api-internal runned in DEVELOPMENT MODE\");\n    } else {\n        println!(\"==> PRODUCTION MODE in api-internal\");\n    }\n";
var checkDocJava = "\n\nimport java.util.Scanner;\npublic class percentage_calculator {\n\n    public static void main(String[] args) {\n\nScanner sc = new Scanner(System.in);\n        System.out.println(\"enter marks in hindi\");\n        float Hindi = sc.nextFloat();\n        System.out.println(\"enter marks in english\");\n        float English = sc.nextFloat();\n        System.out.println(\"enter marks in maths\");\n        float Maths = sc.nextFloat();\n        System.out.println(\"enter marks in science\");\n        float Science = sc.nextFloat();\n        System.out.println(\"enter marks sst\");\n        float SSt = sc.nextFloat();\nfloat Total = Hindi+English+Maths+Science+SSt;\n        System.out.println(\"Total marks obtained =\"+Total);\nfloat CGPA = Total/5;\n        System.out.println(\"CGPA =\" +CGPA);\nfloat Percentage = (float) (9.5 * CGPA);\n        System.out.println(\" Percentage obtained = \" + Percentage);\n\n\n\n    }\n}\n";
var checkDocShell = "\n#!/usr/bin/env bash\n\nmyscript () {\n    typeset a i k;\n\n    # setup cmd; declare functions\n    for i in \"${!g_@}\"; do\n        typeset -n j=$i;\n        typeset \"action_${!j}\";\n        for k in ${j}; do\n            #danger?\n            . /dev/fd/0 <<< \"function ${k} () {\n                readonly action_${!j}=$k 2>/dev/null || {\n                    printf 'error: use only one cmd of: %s\n' '\"$j\"' 1>&2;\n                    return 1;\n                };\n            }\";\n        done;\n    done;\n\n    # setup options\n    :;\n\n    # parse args\n    for a; do\n        if\n            typeset -F \"$a\" 1>/dev/null 2>&1;\n        then\n            \"$a\" && unset -f a || return 1;\n        else\n            echo unkown cmd ... 2>&1;\n            return 1;\n        fi;\n    done;\n\n    for i in \"${!action_@}\"; do\n        typeset -n j=$i;\n        printf '%s: %s\n' \"${!j}\" \"$j\";\n    done;\n};\n\nexport     g_1='create remove'     g_2='modify';\n\necho test 1:\n'myscript' create modify remove;\n\necho test 2:\n'myscript' create modify;\n";
var tryPredicts = [
    checkDocJS,
    checkDocCss,
    checkDocRust,
    checkDocJava,
    checkDocShell
];
var sliceDoc = function (data, count) { return (Object.fromEntries(Object.entries(data).map(function (_a) {
    var label = _a[0], corpus = _a[1];
    return ([
        label,
        corpus.length > count ? corpus.slice(0, count) : corpus
    ]);
}))); };
var main = function () {
    var json = sliceDoc(data_json_1.default, 50);
    var labels = Object.keys(json);
    var parser = new parse_1.LabledCorpus();
    console.time('calculate');
    labels.forEach(function (label, i) {
        console.log("label: " + label + ", docs:" + json[label].length);
        parser.push(label, json[label]);
        console.log("all:" + labels.length + ", i:" + i);
    });
    console.timeEnd('calculate');
    parser.normalize();
    tryPredicts.forEach(function (doc) {
        console.time('predict');
        parser.predictLabel(doc);
        console.timeEnd('predict');
    });
};
var printLabel = function (label) {
    var json = sliceDoc(data_json_1.default, 5);
    console.log(json[label]);
};
main();
// printLabel('Shell')
// exp1: classic obj
// calculate: 40769.242ms
// predict: 2.789ms
// calculate: 26574.327ms
