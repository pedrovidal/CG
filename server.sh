#!/bin/sh
sleep 0.5 && google-chrome http://localhost:8000/ & python -m SimpleHTTPServer 8000
