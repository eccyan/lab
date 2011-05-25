SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/core.js\
    ${SRC_DIR}/ajax.js\
    ${SRC_DIR}/gif.js\
    ${SRC_DIR}/animation.js
    

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

ANIMATOR = ${DIST_DIR}/animator.js
ANIMATOR_MIN = ${DIST_DIR}/animator.min.js

ANIMATOR_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${ANIMATOR_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

all: update_submodules core

core: animator min lint
	@@echo "Build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

animator: ${ANIMATOR}

${ANIMATOR}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${ANIMATOR}

	@@cat ${MODULES} |\
		sed 's/.function...Animator...{//' | \
		sed 's/}...Animator..;//' | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${ANIMATOR};

lint: animator
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking Animator against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js ${ANIMATOR}; \
	else \
		echo "You must have NodeJS installed in order to test Animator against JSLint."; \
	fi

min: animator ${ANIMATOR_MIN}

${ANIMATOR_MIN}: ${ANIMATOR}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying Animator" ${ANIMATOR_MIN}; \
		${COMPILER} ${ANIMATOR} > ${ANIMATOR_MIN}.tmp; \
		${POST_COMPILER} ${ANIMATOR_MIN}.tmp > ${ANIMATOR_MIN}; \
		rm -f ${ANIMATOR_MIN}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify."; \
	fi
	

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

distclean: clean
	@@echo "Removing submodules"
	@@rm -rf test/qunit

# change pointers for submodules and update them to what is specified in Animator
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

pull: pull_submodules
	@@git pull ${REMOTE} ${BRANCH}

.PHONY: all animator lint min clean distclean update_submodules pull_submodules pull core
