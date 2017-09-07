(ns stackim.core
  (:require [compojure.core :refer :all]
            [org.httpkit.server :refer [run-server]]))


(defroutes stackim
  (GET "/" [] "Hello, world!"))


(defn -main []
  (run-server stackim {:port 5000}))
