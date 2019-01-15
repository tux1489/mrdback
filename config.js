var config = {
    'dev': {
        'database': 'mongodb://localhost:27017/mrddev',
        'port': '3002',
        'secret': 'jXWecwsoZhzqg1MjuovlpIgHOzdWDBfF'
    },
    'test': {
        'database': 'mongodb://mus:h6tniq9t@ds047652.mlab.com:47652/mrddb',
        'port': '3002',
        'secret': 'jXWecwsoZhzqg1MjuovlpIgHOzdWDBfF'
    }
}

exports.get = function (env) {
    return config[env] || config.dev;
}