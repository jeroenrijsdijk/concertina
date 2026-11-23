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
#    variables  (may also be secrets)
#               DEPLOY_DIR        folder of the website on the host, e.g. /public_html
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
case "$(echo "$VERIFY" | tr "[:upper:]" "[:lower:]" | tr -d " ")" in no|false|0|off) VERIFY=no ;; *) VERIFY=yes ;; esac
URL="$PROTO://$DEPLOY_SERVER${DEPLOY_PORT:+:$DEPLOY_PORT}"

# If the host's TLS certificate is for another name (common on shared hosting), say which
# names it is for, so DEPLOY_SERVER can be set to one of them and verification can stay on.
explain_certificate() {
  [ "$PROTO" = sftp ] && return 0
  local port="${DEPLOY_PORT:-21}" opt="-starttls ftp"
  [ "$PROTO" = ftps ] && { port="${DEPLOY_PORT:-990}"; opt=""; }
  local cert
  cert=$(openssl s_client -connect "$DEPLOY_SERVER:$port" $opt -servername "$DEPLOY_SERVER" </dev/null 2>/dev/null \
         | openssl x509 -noout -subject -ext subjectAltName 2>/dev/null) || return 0
  [ -n "$cert" ] || return 0
  echo
  echo "The host's certificate is issued for these names:"
  echo "$cert" | sed -n 's/^subject=.*CN *= *\([^,]*\).*/  \1/p; s/^ *DNS:/  /p' | tr ',' '\n' | sed 's/^ *DNS://; s/^ */  /' | sort -u
  echo "Fix: set the secret DEPLOY_SERVER to one of these names (keeps the check),"
  echo "     or set the variable DEPLOY_VERIFY_TLS to no (still encrypted, host not checked)."
}

# Cache busting: the pages ask for keys.js?v=dev etc.; on the website that becomes the
# commit, so a browser never mixes a new page with an old script it has kept.
# Only on GitHub, where the checkout is a throw-away copy (never in your own folder).
if [ "${GITHUB_ACTIONS:-}" = true ]; then
  VERSION="${GITHUB_SHA:0:8}"
  find . -name '*.html' -not -path './.git/*' -exec sed -i "s/?v=dev\"/?v=$VERSION\"/g" {} +
  echo "Version $VERSION"
fi

echo "Uploading to $URL$DEPLOY_DIR"
# The password comes from the environment (LFTP_PASSWORD), never from the command line
if ! lftp -c "
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
"; then
  [ "$VERIFY" = yes ] && explain_certificate
  exit 1
fi
echo "Done."
