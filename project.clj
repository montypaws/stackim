(def project-version "2.0.0-SNAPSHOT")

(defproject stackim project-version
  :description "URL shortener for Stack Overflow profiles"
  :url "http://stack.im/"
  :dependencies [[compojure "1.6.0"]
                 [http-kit "2.2.0"]]
  :main ^:skip-aot stackim.core
  :target-path "target/%s"
  :jar-name "stackim.jar"
  :manifest {"Implementation-Version" ~project-version})
