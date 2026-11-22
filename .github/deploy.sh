#!/usr/bin/env bash
# =============================================================================
#  Copies the website to the web host of jeroenrijsdijk.nl.
#  Run by .github/workflows/deploy.yml after every change on main.
#
#  It only uploads and overwrites: nothing on the host is ever deleted, so other
#  files on the site stay as they are. (A file removed from this repository stays
#  on the host until you delete it there yourself.)
#
#  Settings (GitHub: Settings -> Secrets and variables -> Actions):
#    secrets    DEPLOY_SERVER     host name, e.g. ftp.example.nl
#               DEPLOY_USER       login name
#               DEPLOY_PASSWORD   password
#    variables  DEPLOY_DIR        folder of the website on the host, e.g. /public_html
#               DEPLOY_PROTOCOL   ftp (default; uses TLS when the host offers it), ftps or sftp
#               DEPLOY_PORT       only if the host uses a non-standard port
#               DEPLOY_VERIFY_TLS no = accept a certificate that does not match the host name
# =============================================================================
set -euo pipefail

: "${DEPLOY_SERVER:?Secret DEPLOY_SERVER is not set}"
: "${DEPLOY_USER:?Secret DEPLOY_USER is not set}"
: "${LFTP_PASSWORD:?Secret DEPLOY_PASSWORD is not set}"
: "${DEPLOY_DIR:?Variable DEPLOY_DIR is not set (the website folder on the host, e.g. /public_html)}"

PROTO="${DEPLOY_PROTOCOL:-ftp}"
case "$PROTO" in ftp|ftps|sftp) ;; *) echo "DEPLOY_PROTOCOL must be ftp, ftps or sftp (got: $PROTO)"; exit 1 ;; esac
VERIFY="${DEPLOY_VERIFY_TLS:-yes}"
URL="$PROTO://$DEPLOY_SERVER${DEPLOY_PORT:+:$DEPLOY_PORT}"

echo "Uploading to $URL$DEPLOY_DIR"
# The password comes from the environment (LFTP_PASSWORD), never from the command line
lftp -c "
set cmd:fail-exit yes
set net:max-retries 2
set net:timeout 30
set ftp:ssl-allow yes
set ssl:verify-certificate $VERIFY
set sftp:auto-confirm yes
open --env-password --user \"$DEPLOY_USER\" \"$URL\"
mirror --reverse --no-perms --parallel=4 --verbose \
  --exclude-glob .git/ --exclude-glob .github/ \
  --exclude-glob README.md --exclude-glob LICENSE --exclude-glob CNAME \
  ./ \"$DEPLOY_DIR\"
"
echo "Done."
