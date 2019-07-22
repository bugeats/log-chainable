function pathBaseName (pathStr) {
    const match = pathStr.match(
        /^(([A-Z]:)?[.]?[\\{1,2}/]?.*[\\{1,2}/])*(.+)\.(.+)/
    );
    if (match && match[3]) {
        return match[3];
    }
    return pathStr;
}

module.exports = {
    pathBaseName: pathBaseName
};

